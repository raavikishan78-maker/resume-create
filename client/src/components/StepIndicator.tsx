import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="relative flex justify-between w-full max-w-2xl mx-auto mb-12">
      {/* Connector Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-0 -translate-y-1/2 rounded-full" />
      
      {/* Active Line Progress */}
      <motion.div 
        className="absolute top-1/2 left-0 h-0.5 bg-primary -z-0 -translate-y-1/2 rounded-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentStep / (steps.length - 1) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ width: "100%" }}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="relative z-10 flex flex-col items-center gap-2">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "hsl(var(--background))",
                borderColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted))",
                color: isCompleted || isCurrent ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"
              }}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 shadow-sm
                ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </motion.div>
            <span className={`text-xs font-medium hidden sm:block absolute top-12 w-32 text-center transition-colors duration-300
              ${isCurrent ? 'text-primary font-bold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}
            `}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
