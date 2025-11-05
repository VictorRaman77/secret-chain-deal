"use client";

import { Card } from "@/components/ui/card";
import { WaxSeal } from "./WaxSeal";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CreateOfferDialog } from "./CreateOfferDialog";
import { useAccount, useReadContract, useChainId, usePublicClient } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { SecretDealAbi, getSecretDealAddress } from "@/lib/contracts";
import { useFhevm } from "@/fhevm/useFhevm";
import { Address, toHex } from "viem";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";

interface Offer {
  party: Address;
  revealed: boolean;
  title: string;
  description: string;
  timestamp: bigint;
}

// Type for the offer data returned from the contract
type OfferContractResult = readonly [
  Address,     // partyAddress
  `0x${string}`, // encryptedValue
  bigint,      // timestamp
  boolean,     // revealed
  string,      // title
  string       // description
];

export const NegotiationTable = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const [dealId] = useState<number>(0);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState<boolean>(false);
  
  const contractAddress = getSecretDealAddress(chainId);
  
  // Use the FHEVM hook that supports both Hardhat and Sepolia
  const provider = useMemo(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    return undefined;
  }, []);
  
  const { instance: fhevmInstance, status: fhevmStatus, error: fhevmError } = useFhevm({
    provider,
    chainId,
    enabled: isConnected && !!contractAddress,
  });
  
  const isReady = fhevmStatus === 'ready' && !!fhevmInstance;
  
  const { data: dealData, refetch: refetchDeal } = useReadContract({
    address: contractAddress,
    abi: SecretDealAbi,
    functionName: 'getDeal',
    args: [BigInt(dealId)],
    query: { enabled: !!contractAddress && dealId >= 0 },
  });
  
  const { data: allRevealed, refetch: refetchRevealed } = useReadContract({
    address: contractAddress,
    abi: SecretDealAbi,
    functionName: 'areAllOffersRevealed',
    args: [BigInt(dealId)],
    query: { enabled: !!contractAddress && dealId >= 0 },
  });
  
  const loadOffers = useCallback(async (parties: Address[]) => {
    if (!contractAddress || !publicClient) return;
    
    setIsLoadingOffers(true);
    const loadedOffers: Offer[] = [];
    try {
      for (const party of parties) {
        try {
          const offer = await publicClient.readContract({
            address: contractAddress,
            abi: SecretDealAbi,
            functionName: 'getOfferByParty',
            args: [BigInt(dealId), party],
          }) as OfferContractResult;
          
          loadedOffers.push({
            party,
            revealed: offer[3],
            title: offer[4],
            description: offer[5],
            timestamp: offer[2],
          });
        } catch (error) {
          console.error(`Failed to load offer for ${party}:`, error);
        }
      }
      setOffers(loadedOffers);
    } finally {
      setIsLoadingOffers(false);
    }
  }, [contractAddress, publicClient, dealId]);
  
  useEffect(() => {
    if (dealData && dealData[1]) {
      loadOffers(dealData[1] as Address[]);
    }
  }, [dealData, loadOffers]);
  
  const handleSealBreak = async (party: Address) => {
    if (!contractAddress || !address || party.toLowerCase() !== address.toLowerCase()) {
      toast({
        title: "Not Authorized",
        description: "You can only reveal your own offer",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!window.ethereum) {
        throw new Error("No EVM wallet found");
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(
        contractAddress as `0x${string}`,
        SecretDealAbi,
        signer
      );

      const tx = await contract.revealOffer(BigInt(dealId));
      await tx.wait();
      
      toast({
        title: "Offer Revealed",
        description: "Your secret offer is now visible to all parties",
      });
      
      await refetchDeal();
      await refetchRevealed();
      if (dealData && dealData[1]) {
        await loadOffers(dealData[1] as Address[]);
      }
    } catch (error) {
      console.error('Failed to reveal offer:', error);
      toast({
        title: "Reveal Failed",
        description: error instanceof Error ? error.message : "Could not reveal offer",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateOffer = async (title: string, description: string, value: number): Promise<boolean> => {
    if (!isConnected || !contractAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create offers",
        variant: "destructive",
      });
      return false;
    }

    if (!isReady || !fhevmInstance) {
      toast({
        title: "FHEVM Not Ready",
        description: fhevmError?.message || "Please wait for encryption to initialize",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      console.log('[CreateOffer] Starting encryption...');
      
      toast({
        title: "Encrypting...",
        description: "Creating encrypted value...",
      });

      if (!window.ethereum) {
        throw new Error("No EVM wallet found");
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const userAddress = (await signer.getAddress()) as `0x${string}`;

      const input = fhevmInstance.createEncryptedInput(
        contractAddress as `0x${string}`,
        userAddress
      );
      input.add32(value);
      const encryptedData = await input.encrypt();
      
      const encrypted = {
        handle: encryptedData.handles[0],
        inputProof: encryptedData.inputProof,
      };
      
      console.log('[CreateOffer] Encryption successful');
      
      // Convert Uint8Array to hex string for contract call
      const handleHex: `0x${string}` = encrypted.handle instanceof Uint8Array 
        ? toHex(encrypted.handle) 
        : (encrypted.handle as `0x${string}`);
      const proofHex: `0x${string}` = encrypted.inputProof instanceof Uint8Array 
        ? toHex(encrypted.inputProof) 
        : (encrypted.inputProof as `0x${string}`);

      toast({
        title: "Submitting...",
        description: "Please confirm the transaction in your wallet",
      });

      const contract = new ethers.Contract(
        contractAddress as `0x${string}`,
        SecretDealAbi,
        signer
      );

      const tx: ethers.TransactionResponse = await contract.submitOffer(
        BigInt(dealId),
        handleHex,
        proofHex,
        title,
        description,
      );
      console.log('[CreateOffer] Transaction sent:', tx.hash);
      await tx.wait();
      console.log('[CreateOffer] Transaction confirmed');
      
      toast({
        title: "Offer Submitted",
        description: "Your encrypted offer has been submitted to the blockchain",
      });
      
      await refetchDeal();
      if (dealData && dealData[1]) {
        await loadOffers(dealData[1] as Address[]);
      }
      return true;
    } catch (error) {
      console.error('[CreateOffer] Error:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to submit offer";
      const isAlreadySubmitted = errorMessage.includes("Offer already submitted") || 
                                  errorMessage.includes("already submitted");
      
      toast({
        title: isAlreadySubmitted ? "Offer Already Exists" : "Submission Failed",
        description: isAlreadySubmitted 
          ? "You have already submitted an offer for this deal. Each party can only submit one offer per deal."
          : errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleFinalize = async () => {
    if (!contractAddress) return;
    
    try {
      if (!window.ethereum) {
        throw new Error("No EVM wallet found");
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(
        contractAddress as `0x${string}`,
        SecretDealAbi,
        signer
      );

      const tx = await contract.finalizeDeal(BigInt(dealId));
      await tx.wait();
      
      toast({
        title: "Deal Finalized",
        description: "Agreement has been recorded on-chain",
      });
      
      await refetchDeal();
    } catch (error) {
      toast({
        title: "Finalization Failed",
        description: error instanceof Error ? error.message : "Could not finalize deal",
        variant: "destructive",
      });
    }
  };
  
  const allOffersRevealed = allRevealed || false;
  
  if (!contractAddress) {
    return (
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Contract not deployed on this network</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Negotiation Table</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {offers.length} offer(s) submitted
          </p>
          <CreateOfferDialog onCreateOffer={handleCreateOffer} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingOffers ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-muted-foreground">No offers submitted yet</p>
              <p className="text-sm text-muted-foreground mt-2">Be the first to submit an encrypted offer</p>
            </div>
          ) : (
            offers.map((offer, index) => (
              <div
                key={offer.party}
                className="flex flex-col items-center space-y-4"
              >
                <h3 className="text-lg font-semibold text-parchment">
                  Party {index + 1}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {offer.party.slice(0, 6)}...{offer.party.slice(-4)}
                </p>
                
                {!offer.revealed ? (
                  <div className="flex flex-col items-center space-y-4">
                    <WaxSeal onBreak={() => handleSealBreak(offer.party)} />
                    <p className="text-sm text-muted-foreground text-center">
                      {offer.party.toLowerCase() === address?.toLowerCase()
                        ? "Click to reveal your offer"
                        : "Waiting for party to reveal"}
                    </p>
                  </div>
                ) : (
                  <Card className="w-full p-6 bg-card/80 backdrop-blur-sm border-border/50 text-card-foreground animate-document-reveal">
                    <div className="space-y-3">
                      <p className="font-bold text-lg border-b border-border/50 pb-2 text-foreground">
                        {offer.title}
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-semibold text-muted-foreground">Terms:</p>
                        <p className="text-foreground/80 whitespace-pre-wrap">
                          {offer.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))
          )}
        </div>

        {allOffersRevealed && offers.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              size="lg"
              onClick={handleFinalize}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={dealData && dealData[4]}
            >
              {dealData && dealData[4] ? "Deal Finalized" : "Finalize Agreement"}
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              {dealData && dealData[4]
                ? "This deal has been finalized on-chain"
                : "Submit final agreement to blockchain"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

