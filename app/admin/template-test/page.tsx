"use client";

import { useState, useEffect } from "react";
import { CardTemplate } from "@/components/preview/CardTemplate";
import { Wand2, Loader2 } from "lucide-react";

const THEMES_LIST = [
  { id: "futebol-2026", name: "Futebol 2026" },
  { id: "futebol-panini", name: "Futebol Panini" },
  { id: "futebol-familia", name: "Futebol Família" },
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

export default function TemplateTestPage() {
  const [selectedTheme, setSelectedTheme] = useState("futebol-2026");
  const [photoUrl, setPhotoUrl] = useState("");
  const [genero, setGenero] = useState("Masculino");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptUsed, setPromptUsed] = useState("");

  // Auto-load default Fernando template image
  useEffect(() => {
    const defaultImagePath = "/ngenerated-images/FERNANDO-TEMPLATE.jpg";
    const img = new Image();
    img.onload = () => {
      // Convert to data URL via canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setPhotoUrl(canvas.toDataURL("image/jpeg", 0.9));
        console.log("✅ Imagem padrão FERNANDO-TEMPLATE carregada");
      }
    };
    img.onerror = () => {
      console.log("⚠️ Imagem padrão não encontrada, aguardando upload manual");
    };
    img.src = defaultImagePath;
  }, []);

  const mockFormData = {
    nome: "FERNANDO PARMEZANI",
    genero,
    pais: "Brasil",
    posicao: "Atacante",
    numero: "10",
    time: "São Paulo",
    dataNascimento: "1976-08-04",
    altura: "1.82",
    peso: "95",
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoUrl(dataUrl);
        console.log("✅ Foto carregada:", file.name, dataUrl.substring(0, 60));
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
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
          packageType: "individual",
        }),
      });

      console.log("📡 Response status:", response.status);
      const data = await response.json();
      const firstImage = data.images?.[0];
      console.log("✓ Data recebida:", { total: data.totalGenerated, isMock: firstImage?.isMock, hasImageUrl: !!firstImage?.imageUrl });

      if (firstImage?.originalImageUrl || firstImage?.imageUrl) {
        setGeneratedImageUrl(firstImage.originalImageUrl || firstImage.imageUrl);
        setPromptUsed(firstImage.promptUsed || "");
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


  return (
    <div className="min-h-screen bg-[#0F172A] pt-24 pb-16">
      <div className="section-container">
        <h1 className="text-4xl font-bold text-white mb-2">Template Test + Geração</h1>
        <p className="text-[#94A3B8] mb-8">Teste de geração de imagem — preview bruto sem overlay</p>

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

        {/* Family theme warning */}
        {selectedTheme === "futebol-familia" && (
          <div className="mb-6 max-w-2xl p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <p className="text-yellow-200 text-sm font-medium">⚠️ Aviso técnico — Futebol Família</p>
            <p className="text-yellow-100/80 text-xs mt-1">
              A IA text-to-image cria pessoas baseadas em descrição de texto. Os rostos gerados
              <strong> não serão idênticos</strong> aos das fotos enviadas — apenas aproximados.
              Para preservar o rosto exato de cada pessoa, recomendamos gerar cards individuais (Futebol 2026 / Panini).
            </p>
          </div>
        )}

        {/* Upload section */}
        <div className="mb-8 max-w-md">
          <label className="block text-white font-medium mb-3">Envie sua foto:</label>
          <label
            htmlFor="photo-input"
            className="block border-2 border-dashed border-[#2563EB] rounded-xl p-6 text-center cursor-pointer hover:bg-[#1E293B]/50 transition-colors"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isGenerating}
              className="hidden"
              id="photo-input"
            />
            {photoUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-32 h-40 object-cover rounded-lg border border-[#334155]"
                />
                <p className="text-green-400 text-sm">✓ Foto carregada</p>
              </div>
            ) : (
              <p className="text-[#94A3B8]">Clique para enviar ou arraste uma foto</p>
            )}
          </label>
        </div>

        {/* Gender selector */}
        <div className="mb-8 max-w-md">
          <label className="block text-white font-medium mb-3">Gênero:</label>
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:border-[#2563EB] focus:outline-none"
          >
            <option value="Masculino">Homem</option>
            <option value="Feminino">Mulher</option>
          </select>
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

        {/* Card preview with template overlay */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-full max-w-sm aspect-[9/11] bg-black rounded-2xl overflow-hidden shadow-2xl">
            <CardTemplate
              themeId={selectedTheme}
              photoUrl={photoUrl}
              generatedImageUrl={generatedImageUrl}
              formData={mockFormData}
              showWatermark={false}
            />
          </div>

          {generatedImageUrl && (
            <p className="text-green-400 text-sm">✓ Imagem gerada pela IA</p>
          )}
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
              Este é o prompt enviado ao modelo de geração de imagem
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
