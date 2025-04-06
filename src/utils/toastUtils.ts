
import { toast } from "@/hooks/use-toast";

// Show toast notification
export const showToast = (
  title: string,
  description: string,
  variant?: "default" | "destructive"
): void => {
  toast({
    title,
    description,
    variant
  });
};
