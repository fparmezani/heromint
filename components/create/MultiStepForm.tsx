"use client";

import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";
import { Stepper } from "./Stepper";
import { PackageSelector } from "./PackageSelector";
import { PhotoGuide } from "./PhotoGuide";
import { GeneratingPage } from "@/components/loading/GeneratingPage";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import type { Theme } from "@/types/theme";
import type { PackageType } from "@/types/collectible";

const STEPS = ["Dados Principais", "Detalhes", "Sua Foto", "Pacote"];
const MAX_FAMILY_REFERENCE_PHOTOS = 5;

interface MultiStepFormProps {
  theme: Theme;
}

export function MultiStepForm({ theme }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
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
      if (photoUrls.length === 0) {
        alert("Por favor, envie pelo menos uma foto antes de continuar.");
        return;
      }
      if (theme.id === "futebol-familia") {
        const familySize = Number(formData.quantidadeMembros);
        if (familySize > MAX_FAMILY_REFERENCE_PHOTOS) {
          alert(`A foto de família aceita no máximo ${MAX_FAMILY_REFERENCE_PHOTOS} membros.`);
          return;
        }
        if (photoUrls.length !== familySize) {
          alert(`Envie exatamente uma foto para cada membro da família (${familySize} fotos).`);
          return;
        }
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

      // Convert blob URLs → base64 so the server can send to Replicate
      const photoBase64s: string[] = [];
      for (const url of photoUrls) {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          photoBase64s.push(base64);
        } catch {
          // skip failed conversions
        }
      }

      const maxPhotos =
        theme.id === "futebol-familia" ? MAX_FAMILY_REFERENCE_PHOTOS :
        packageType === "individual" ? 1 :
        packageType === "premium" ? 5 :
        10;
      const photosToSend = photoBase64s.slice(0, maxPhotos);

      const data = await generateImages(
        theme.id,
        allFormData,
        photosToSend.length > 0 ? photosToSend : "",
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
          photoUrls,                    // blob URLs for card template overlay
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
                <h3 className="text-xl font-bold text-white mb-1">Suas Fotos</h3>
                <p className="text-[#94A3B8] text-sm">
                  {theme.id === "futebol-familia"
                    ? `Envie uma foto individual de cada membro da família, até ${MAX_FAMILY_REFERENCE_PHOTOS} pessoas.`
                    : `Envie até ${packageType === "individual" ? 1 : packageType === "premium" ? 5 : 10} fotos. ${packageType !== "individual" ? "Fotos em excesso serão ignoradas." : ""}`}
                </p>
              </div>
              {theme.id === "futebol-familia" && (
                <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-yellow-200/90 text-xs">
                    <strong>Para melhorar a fidelidade:</strong> envie uma foto frontal, bem iluminada e individual
                    de cada pessoa. A IA usará essas fotos como referências visuais na montagem da família.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {photoUrls.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-[#1E293B] aspect-[3/4]">
                    <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrls(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                    >
                      <span className="text-xs">×</span>
                    </button>
                    <div className="absolute bottom-2 left-2 text-[#22C55E] text-xs font-medium bg-black/50 px-2 py-0.5 rounded">
                      Foto {idx + 1} ✓
                    </div>
                  </div>
                ))}
                {(theme.id === "futebol-familia" ? photoUrls.length < MAX_FAMILY_REFERENCE_PHOTOS : packageType === "individual" ? photoUrls.length < 1 : photoUrls.length < (packageType === "premium" ? 5 : 10)) && (
                  <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#1E293B] bg-[#0F172A] hover:border-[#2563EB]/50 cursor-pointer aspect-[3/4] min-h-[180px]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPhotoUrls(prev => [...prev, url]);
                        }
                      }}
                    />
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">+</span>
                    </div>
                    <p className="text-[#94A3B8] text-sm">Adicionar foto</p>
                  </label>
                )}
              </div>
              <PhotoGuide />
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
