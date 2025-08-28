import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "primary" | "secondary" | "outline";
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold border-0 shadow-lg shadow-primary/25",
      secondary: "bg-gradient-card hover:bg-opacity-80 text-foreground border border-border/50",
      outline: "border-2 border-primary/50 bg-background/50 hover:bg-primary/10 text-foreground backdrop-blur-sm"
    };

    return (
      <Button
        className={cn(
          "transition-all duration-300 hover:scale-105 active:scale-95",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };