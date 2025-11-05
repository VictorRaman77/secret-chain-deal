"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateOfferDialogProps {
  onCreateOffer: (title: string, description: string, value: number) => Promise<boolean>;
}

// Maximum value for euint32 (2^32 - 1)
const MAX_OFFER_VALUE = 4294967295;

export const CreateOfferDialog = ({ onCreateOffer }: CreateOfferDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [terms, setTerms] = useState("");
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !terms.trim() || !value.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (numValue > MAX_OFFER_VALUE) {
      toast({
        title: "Value Too Large",
        description: `Maximum offer value is ${MAX_OFFER_VALUE.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onCreateOffer(title, terms, numValue);
      if (success) {
        setTitle("");
        setTerms("");
        setValue("");
        setOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-seal">
          <Plus className="w-4 h-4" />
          Create New Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Create Diplomatic Offer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Draft your encrypted proposal. It will remain sealed until all parties finalize.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Offer Title</Label>
            <Input
              id="title"
              placeholder="e.g., Trade Alliance Proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Offer Value (Encrypted)</Label>
            <Input
              id="value"
              type="number"
              placeholder="e.g., 1000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-background border-border"
            />
            <p className="text-xs text-muted-foreground">
              This value will be encrypted and hidden until revealed
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              placeholder="Describe your diplomatic terms, resources offered, conditions..."
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="min-h-[120px] bg-background border-border"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-seal"
            >
              {isSubmitting ? "Submitting..." : "Seal & Encrypt Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

