"use client";

import { useState, useMemo } from "react";
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
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateOfferDialogProps {
  onCreateOffer: (title: string, description: string, value: number) => Promise<boolean>;
}

// Validation constants
const MAX_OFFER_VALUE = 4294967295; // Maximum value for euint32 (2^32 - 1)
const MAX_TITLE_LENGTH = 100;
const MAX_TERMS_LENGTH = 1000;
const MIN_TERMS_LENGTH = 10;

export const CreateOfferDialog = ({ onCreateOffer }: CreateOfferDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [terms, setTerms] = useState("");
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    const titleTrimmed = title.trim();
    const termsTrimmed = terms.trim();
    const numValue = parseInt(value);

    // Title validation
    if (titleTrimmed.length === 0) {
      errors.push("Title is required");
    } else if (titleTrimmed.length > MAX_TITLE_LENGTH) {
      errors.push(`Title must be under ${MAX_TITLE_LENGTH} characters`);
    }

    // Value validation
    if (value.trim() === "") {
      errors.push("Offer value is required");
    } else if (isNaN(numValue) || numValue < 0) {
      errors.push("Value must be a positive number");
    } else if (numValue > MAX_OFFER_VALUE) {
      errors.push("Value exceeds maximum limit");
    }

    // Terms validation
    if (termsTrimmed.length === 0) {
      errors.push("Terms are required");
    } else if (termsTrimmed.length < MIN_TERMS_LENGTH) {
      errors.push(`Terms must be at least ${MIN_TERMS_LENGTH} characters`);
    } else if (termsTrimmed.length > MAX_TERMS_LENGTH) {
      errors.push(`Terms must be under ${MAX_TERMS_LENGTH} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      titleLength: titleTrimmed.length,
      termsLength: termsTrimmed.length,
    };
  }, [title, terms, value]);

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
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Offer Title</Label>
              <span className={`text-xs ${validation.titleLength > MAX_TITLE_LENGTH ? "text-destructive" : "text-muted-foreground"}`}>
                {validation.titleLength}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <Input
              id="title"
              placeholder="e.g., Trade Alliance Proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE_LENGTH + 10}
              className={`bg-background border-border ${title && validation.titleLength <= MAX_TITLE_LENGTH ? "border-green-500/50" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Offer Value (Encrypted)</Label>
            <Input
              id="value"
              type="number"
              min="0"
              max={MAX_OFFER_VALUE}
              placeholder="e.g., 1000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`bg-background border-border ${value && !isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= MAX_OFFER_VALUE ? "border-green-500/50" : ""}`}
            />
            <p className="text-xs text-muted-foreground">
              This value will be encrypted and hidden until revealed (max: {MAX_OFFER_VALUE.toLocaleString()})
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <span className={`text-xs ${validation.termsLength > MAX_TERMS_LENGTH ? "text-destructive" : validation.termsLength < MIN_TERMS_LENGTH ? "text-amber-500" : "text-muted-foreground"}`}>
                {validation.termsLength}/{MAX_TERMS_LENGTH}
              </span>
            </div>
            <Textarea
              id="terms"
              placeholder="Describe your diplomatic terms, resources offered, conditions..."
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              maxLength={MAX_TERMS_LENGTH + 50}
              className={`min-h-[120px] bg-background border-border ${validation.termsLength >= MIN_TERMS_LENGTH && validation.termsLength <= MAX_TERMS_LENGTH ? "border-green-500/50" : ""}`}
            />
            {validation.termsLength > 0 && validation.termsLength < MIN_TERMS_LENGTH && (
              <p className="text-xs text-amber-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                At least {MIN_TERMS_LENGTH} characters required
              </p>
            )}
          </div>
          
          {/* Validation summary */}
          {title || terms || value ? (
            <div className={`p-3 rounded-md text-sm ${validation.isValid ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
              {validation.isValid ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All fields are valid</span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Please fix the following:</span>
                    <ul className="list-disc list-inside mt-1">
                      {validation.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : null}

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
              disabled={isSubmitting || !validation.isValid}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-seal disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Seal & Encrypt Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

