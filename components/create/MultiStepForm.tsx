"use client";

import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";
import { Stepper } from "./Stepper";
import { UploadZone } from "./UploadZone";
import { PackageSelector } from "./PackageSelector";
import { GeneratingPage } from "@/components/loading/GeneratingPage";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import type { Theme } from "@/types/theme";
import type { PackageType } from "@/types/collectible";

const STEPS = ["Dados Principais", "Detalhes", "Sua Foto", "Pacote"];

interface MultiStepFormProps {
  theme: Theme;
}

export function MultiStepForm({ theme }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [photoUrl, setPhotoUrl] = useState("");
  const [packageType, setPackageType] = useState<PackageType>("premium");
  const router = useRouter();
  const {
    isGenerating,
    currentStep: generatingStep,
    totalSteps: generatingTotalSteps,
    generateImages,
    reset: resetGeneration,
  } = useImageGeneration();

  // Split fields into groups
  const half = Math.ceil(theme.fields.length / 2);
  const step0Fields = theme.fields.slice(0, half);
  const step1Fields = theme.fields.slice(half);

  const buildSchema = (fields: typeof theme.fields) => {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((f) => {
      shape[f.key] = f.required
        ? z.string().min(1, `${f.label} é obrigatório`)
        : z.string().optional();
    });
    return z.object(shape);
  };

  const schema0 = buildSchema(step0Fields);
  const schema1 = buildSchema(step1Fields);

  const form0 = useForm({ resolver: zodResolver(schema0), defaultValues: formData });
  const form1 = useForm({ resolver: zodResolver(schema1), defaultValues: formData });

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await form0.trigger();
      if (!valid) return;
      setFormData((prev) => ({ ...prev, ...(form0.getValues() as Record<string, string>) }));
    } else if (currentStep === 1) {
      const valid = await form1.trigger();
      if (!valid) return;
      setFormData((prev) => ({ ...prev, ...(form1.getValues() as Record<string, string>) }));
    } else if (currentStep === 2) {
      if (!photoUrl) {
        alert("Por favor, envie sua foto antes de continuar.");
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      const allFormData = {
        ...formData,
        ...(form0.getValues() as Record<string, string>),
        ...(form1.getValues() as Record<string, string>),
      };

      // Convert blob URL → base64 so the server can send it to Replicate
      let photoBase64: string | null = null;
      if (photoUrl) {
        try {
          const res = await fetch(photoUrl);
          const blob = await res.blob();
          photoBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch {
          photoBase64 = null;
        }
      }

      const data = await generateImages(
        theme.id,
        allFormData,
        photoBase64 || "",
        packageType
      );

      if (data.collectibleId) {
        // Save everything to localStorage for the preview page
        localStorage.setItem(`heromint_preview_${data.collectibleId}`, JSON.stringify({
          collectibleId: data.collectibleId,
          theme: theme.id,
          themeName: theme.name,
          themeIcon: theme.icon,
          packageType,
          formData: allFormData,
          photoUrl,                    // blob URL for card template overlay
          generatedImages: data.images, // Array of generated images
          totalGenerated: data.totalGenerated,
          // Keep backward compatibility
          generatedImageUrl: data.images?.[0]?.imageUrl, 
          isMock: data.images?.[0]?.isMock || false,
        }));
        router.push(`/preview/${data.collectibleId}`);
      } else {
        throw new Error("Erro ao gerar card");
      }
    } catch (error) {
      alert("Erro ao gerar seu card. Tente novamente.");
      resetGeneration();
    }
  };

  const renderField = (field: typeof theme.fields[0], form: ReturnType<typeof useForm<FieldValues>>) => {
    const error = form.formState.errors[field.key];

    return (
      <div key={field.key} className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {field.type === "select" ? (
          <select
            {...form.register(field.key)}
            className="w-full h-12 px-4 rounded-xl bg-[#0F172A] border border-[#1E293B] text-white focus:outline-none focus:border-[#2563EB] transition-colors"
          >
            <option value="">Selecione...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            {...form.register(field.key)}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full h-12 px-4 rounded-xl bg-[#0F172A] border border-[#1E293B] text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        )}
        {error && (
          <span className="text-red-400 text-xs">{error.message as string}</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Stepper */}
      <div className="mb-10">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Form content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 md:p-8"
        >
          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h3 className="text-xl font-bold text-white mb-1">Dados Principais</h3>
                <p className="text-[#94A3B8] text-sm">Preencha as informações básicas do seu card.</p>
              </div>
              {step0Fields.map((field) => renderField(field, form0))}
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h3 className="text-xl font-bold text-white mb-1">Detalhes do Personagem</h3>
                <p className="text-[#94A3B8] text-sm">Personalize ainda mais seu card épico.</p>
              </div>
              {step1Fields.length > 0
                ? step1Fields.map((field) => renderField(field, form1))
                : (
                  <div className="text-center py-8 text-[#94A3B8]">
                    <p>Todos os dados já foram preenchidos!</p>
                    <p className="text-sm mt-1">Clique em &quot;Próximo&quot; para continuar.</p>
                  </div>
                )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h3 className="text-xl font-bold text-white mb-1">Sua Foto</h3>
                <p className="text-[#94A3B8] text-sm">Envie uma foto com rosto bem iluminado e visível.</p>
              </div>
              <UploadZone value={photoUrl} onChange={setPhotoUrl} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h3 className="text-xl font-bold text-white mb-1">Escolha seu Pacote</h3>
                <p className="text-[#94A3B8] text-sm">Selecione a quantidade de versões do seu card.</p>
              </div>
              <PackageSelector value={packageType} onChange={setPackageType} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="btn-secondary flex-1 text-sm h-12 rounded-xl"
            disabled={isGenerating}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        )}

        {currentStep < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary flex-1 text-sm h-12 rounded-xl"
          >
            Próximo
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating}
            className="btn-primary flex-1 text-sm h-12 rounded-xl animate-glow-pulse"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-xs">Gerando...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Gerar Meu Card com IA
              </>
            )}
          </button>
        )}
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <GeneratingPage
              themeName={theme.name}
              themeIcon={theme.icon}
              packageType={packageType}
              currentStep={generatingStep}
              totalSteps={generatingTotalSteps}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
