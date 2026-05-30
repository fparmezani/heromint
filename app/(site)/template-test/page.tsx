"use client";

import { useState } from "react";
import { CardTemplate } from "@/components/preview/CardTemplate";
import { Wand2, Loader2 } from "lucide-react";

const THEMES_LIST = [
  { id: "futebol-2026", name: "Futebol 2026" },
  { id: "hero-card", name: "Hero Card" },
  { id: "profissional-premium", name: "Profissional Premium" },
  { id: "reino-medieval", name: "Reino Medieval" },
  { id: "escola-de-magia", name: "Escola de Magia" },
  { id: "baby-hero", name: "Baby Hero" },
  { id: "family-pack", name: "Family Pack" },
  { id: "pet-star", name: "Pet Star" },
  { id: "battle-card", name: "Battle Card" },
  { id: "avatar-poster", name: "Avatar/Poster" },
];

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='768'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(100,150,200);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgb(50,100,150);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='768' fill='url(%23grad)'/%3E%3Ctext x='256' y='384' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3ETemplate Test%3C/text%3E%3C/svg%3E";

export default function TemplateTestPage() {
  const [selectedTheme, setSelectedTheme] = useState("futebol-2026");
  const [photoUrl, setPhotoUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptUsed, setPromptUsed] = useState("");

  const mockFormData = {
    nome: "FERNANDO",
    pais: "Brasil",
    posicao: "Atacante",
    numero: "10",
    time: "Seleção",
    dataNascimento: "1976-08-04",
    altura: "1.82",
    peso: "95",
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!photoUrl) {
      alert("Por favor, envie uma foto primeiro");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("🚀 Gerando com tema:", selectedTheme);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          formData: mockFormData,
          photoBase64: photoUrl,
          packageType: "premium",
        }),
      });

      console.log("📡 Response status:", response.status);
      const data = await response.json();
      console.log("✓ Data recebida:", { isMock: data.isMock, hasImageUrl: !!data.imageUrl, hasPrompt: !!data.promptUsed });

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setPromptUsed(data.promptUsed || "");
        console.log("✅ Imagem e prompt carregados");
      } else {
        alert("Erro ao gerar: " + (data.error || "desconhecido"));
      }
    } catch (err) {
      alert("Erro ao gerar imagem: " + String(err));
      console.error("❌ Erro:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const displayImage = generatedImageUrl || photoUrl || PLACEHOLDER_IMAGE;

  return (
    <div className="min-h-screen bg-[#0F172A] pt-24 pb-16">
      <div className="section-container">
        <h1 className="text-4xl font-bold text-white mb-2">Template Test + Geração</h1>
        <p className="text-[#94A3B8] mb-8">Teste template com Replicate FLUX Kontext Pro</p>

        {/* Theme selector */}
        <div className="mb-8 flex flex-wrap gap-3">
          {THEMES_LIST.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTheme === theme.id
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]"
              }`}
              disabled={isGenerating}
            >
              {theme.name}
            </button>
          ))}
        </div>

        {/* Upload section */}
        <div className="mb-8 max-w-md">
          <label className="block text-white font-medium mb-3">Envie sua foto:</label>
          <div className="border-2 border-dashed border-[#2563EB] rounded-xl p-6 text-center cursor-pointer hover:bg-[#1E293B]/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isGenerating}
              className="hidden"
              id="photo-input"
            />
            <label htmlFor="photo-input" className="cursor-pointer">
              <p className="text-[#94A3B8]">Clique para enviar ou arraste uma foto</p>
              {photoUrl && <p className="text-green-400 text-sm mt-2">✓ Foto enviada</p>}
            </label>
          </div>
        </div>

        {/* Generate button */}
        <div className="mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !photoUrl}
            className="btn-primary px-6 h-12 rounded-xl inline-flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Gerar Card com Replicate
              </>
            )}
          </button>
        </div>

        {/* Card preview */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-sm aspect-[9/11] bg-black rounded-2xl overflow-hidden shadow-2xl">
            <CardTemplate
              themeId={selectedTheme}
              photoUrl={displayImage}
              generatedImageUrl={generatedImageUrl}
              formData={mockFormData}
              showWatermark={false}
            />
          </div>
        </div>

        {/* Debug: raw image test */}
        <div className="mt-12 border-2 border-blue-500 p-4 rounded-lg">
          <p className="text-white font-bold mb-4">Debug: Raw Image Test</p>
          <img
            src={displayImage}
            alt="debug"
            style={{ width: '200px', height: '300px', border: '2px solid red' }}
          />
          <p className="text-gray-400 text-xs mt-2 break-words">
            photoUrl={displayImage?.substring(0, 80)}...
          </p>
        </div>

        {/* Info */}
        <div className="mt-12 text-center">
          <p className="text-[#94A3B8] text-sm">
            Tema: <span className="text-white font-bold">{selectedTheme}</span>
          </p>
          <p className="text-[#94A3B8] text-xs mt-2">
            {generatedImageUrl ? "✓ Imagem gerada com preview mock" : "Aguardando geração..."}
          </p>
        </div>

        {/* Prompt Display */}
        {promptUsed && (
          <div className="mt-8 max-w-2xl mx-auto border-2 border-[#2563EB] rounded-lg p-6 bg-[#0F172A]/50">
            <p className="text-white font-bold mb-3">📝 Prompt Detalhado Usado:</p>
            <div className="bg-[#1E293B] rounded p-4 max-h-96 overflow-y-auto">
              <p className="text-[#E2E8F0] text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {promptUsed}
              </p>
            </div>
            <p className="text-[#64748B] text-xs mt-3">
              Este é o prompt que será enviado ao FLUX Kontext Pro para gerar a imagem real após pagamento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
