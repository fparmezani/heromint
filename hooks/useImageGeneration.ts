"use client";

import { useState, useCallback } from "react";
import type { PackageType } from "@/types/collectible";

interface GenerationState {
  isGenerating: boolean;
  currentStep: number;
  totalSteps: number;
  error: string | null;
}

interface GenerationResult {
  collectibleId: string;
  images: Array<{
    imageUrl: string;
    promptUsed: string;
    isMock: boolean;
  }>;
  totalGenerated: number;
  packageType: PackageType;
  theme: string;
  formData: Record<string, string>;
}

const GENERATION_STEPS = [
  "Preparando dados...",
  "Analisando imagem...",
  "Gerando prompts personalizados...",
  "Criando arte com IA...",
  "Aplicando efeitos...",
  "Finalizando cards...",
];

export function useImageGeneration() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    currentStep: 0,
    totalSteps: GENERATION_STEPS.length,
    error: null,
  });

  const generateImages = useCallback(async (
    theme: string,
    formData: Record<string, string>,
    photoBase64: string | string[],
    packageType: PackageType
  ): Promise<GenerationResult> => {
    setState({
      isGenerating: true,
      currentStep: 0,
      totalSteps: GENERATION_STEPS.length,
      error: null,
    });

    try {
      // Simulate step progression
      const stepInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
        }));
      }, 2000);

      const body = Array.isArray(photoBase64)
        ? { theme, formData, photosBase64: photoBase64, packageType }
        : { theme, formData, photoBase64, packageType };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error("Erro na geração");
      }

      const data = await response.json();

      // Complete the progress
      setState(prev => ({
        ...prev,
        currentStep: prev.totalSteps,
      }));

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState({
        isGenerating: false,
        currentStep: 0,
        totalSteps: GENERATION_STEPS.length,
        error: null,
      });

      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      currentStep: 0,
      totalSteps: GENERATION_STEPS.length,
      error: null,
    });
  }, []);

  return {
    ...state,
    generateImages,
    reset,
    stepName: GENERATION_STEPS[state.currentStep] || "Finalizando...",
  };
}
