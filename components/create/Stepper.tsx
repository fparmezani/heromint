"use client";

import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1E293B]">
          <div
            className="h-full gradient-bg transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step} className="relative flex flex-col items-center gap-2 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                  isCompleted
                    ? "gradient-bg border-transparent text-white"
                    : isActive
                    ? "border-[#2563EB] bg-[#0F172A] text-[#2563EB]"
                    : "border-[#1E293B] bg-[#0F172A] text-[#94A3B8]"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-white" : isCompleted ? "text-[#2563EB]" : "text-[#94A3B8]"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden flex items-center justify-between">
        <span className="text-sm text-[#94A3B8]">
          Passo <span className="text-white font-bold">{currentStep + 1}</span> de {steps.length}
        </span>
        <span className="text-sm font-bold text-white">{steps[currentStep]}</span>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden mt-3 h-1 bg-[#1E293B] rounded-full overflow-hidden">
        <div
          className="h-full gradient-bg transition-all duration-500 rounded-full"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
