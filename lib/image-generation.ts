
import Replicate from "replicate";
import { generateCustomizedPrompt } from "./claude-vision-prompt";

export interface GenerateImageInput {
  theme: string;
  formData: Record<string, string>;
  uploadedImageBase64?: string;
  versions?: number;
}

export interface GenerateImageResult {
  imageUrl: string;
  promptUsed: string;
  isMock: boolean;
  templateUsed?: string; // Track which template was used for this image
}

export interface GenerateMultipleImagesResult {
  images: GenerateImageResult[];
  totalGenerated: number;
}

const replicate = new Replicate({
  auth: (process.env.REPLICATE_API_TOKEN ?? "").trim(),
});

// ── DETAILED STRUCTURED PROMPTS FOR PREMIUM GENERATION ──────────────────────
function getDetailedPrompt(theme: string, formData: Record<string, string>): string {
  const nome = formData.nome || "Player";

  const prompts: Record<string, string> = {
    "futebol-2026": `Create a PREMIUM VERTICAL COLLECTIBLE FOOTBALL CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face, neck, shoulders to chest visible, maximum person visibility
- KEEP FACE EXACTLY THE SAME, facing camera directly, confident expression
- JERSEY: Bright yellow and green Brazilian Seleção style (no real Nike/CBF logos), NUMBER 10 on chest
- BACKGROUND: Dark green stadium atmosphere with golden light flares, subtle particles, professional collectible-card aesthetic
- CARD STYLE: Clean edges, no border, glossy premium finish, professional sports card photography
- LIGHTING: Dramatic cinematic lighting with golden highlights and green glow
- EFFECTS: Sparkles, lens flares, subtle smoke, rim light on edges
- DEPTH: Strong depth of field effect
- QUALITY: Photorealistic, high contrast, glossy sports card finish
- AVOID: Real logos, distorted face, text errors, extra fingers, low resolution, borders, frames`,

    "futebol-panini": `Create a premium collectible football sticker card inspired by classic Panini tournament albums. Use the uploaded image as the exact face identity of the player. Preserve facial features, hairstyle, beard, skin tone and expression perfectly. Show a front-facing professional football player portrait from chest up, wearing a bright yellow and green Brazil-inspired football jersey with number 10. Background with vibrant turquoise/teal color (#00B4A6) and large oversized green rounded numbers "26" behind the player. Add a circular Brazilian flag badge on the right side and vertical "BRASIL" text. Clean modern aesthetic without information bars at bottom - let the turquoise background show. Remove all Panini branding, FIFA branding, trademarks and official tournament logos. Ultra realistic face, studio lighting, premium glossy sticker finish, collectible card aesthetic, centered composition, 1024x1536 vertical format, sharp focus, print-quality details. Clean edges, no border, avoid borders and frames.`,

    "hero-card": `Create a PREMIUM DARK FANTASY COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, facing camera, maximum person visibility
- KEEP FACE EXACTLY THE SAME, heroic confident expression
- COSTUME: Epic dark fantasy armor with PURPLE GLOWING RUNES, ornate details, fantasy materials
- BACKGROUND: Dark magical battlefield with purple/blue mystical energy, glowing effects, fog
- CARD STYLE: Clean edges, no border, magical sheen, premium fantasy photography
- LIGHTING: Dramatic cinematic with purple/blue glow, rim lighting, mystical aura around figure
- EFFECTS: Magic sparkles, glowing runes, ethereal mist, lens flares
- DEPTH: Strong depth of field, background slightly blurred
- QUALITY: Photorealistic fantasy cinematic, premium collectible finish
- AVOID: Real logos, distorted face, text errors, extra fingers, low quality, borders, frames`,

    "profissional-premium": `Create a PREMIUM PROFESSIONAL BUSINESS CARD PORTRAIT.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to chest visible, fill all space, professional composition
- KEEP FACE EXACTLY THE SAME, confident professional expression
- CLOTHING: Sharp tailored business suit (dark navy or charcoal), crisp collar, professional appearance
- BACKGROUND: Modern sophisticated office setting with soft city lights bokeh, warm accent lighting, subtle gradient
- CARD STYLE: Clean edges, no border, professional matte finish with slight sheen, executive photography
- LIGHTING: Professional studio lighting with warm key light, subtle fill, professional headshot quality
- EFFECTS: Soft bokeh background, subtle rim lighting, professional color grading
- DEPTH: Professional shallow depth of field
- QUALITY: Premium professional photography quality, magazine-cover level
- AVOID: Casual elements, distorted face, informal styling, low resolution, borders, frames`,

    "reino-medieval": `Create a PREMIUM MEDIEVAL KNIGHT COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, centered composition, maximum visibility
- KEEP FACE EXACTLY THE SAME, noble confident medieval expression
- COSTUME: Full ornate medieval KNIGHT ARMOR (polished steel, gold accents), royal cape (deep red/gold), shield emblem (generic heraldic design)
- BACKGROUND: Medieval castle environment with torchlight, stone walls, dramatic sky, historical atmosphere
- CARD STYLE: Clean edges, no border, aged parchment look with golden shine, medieval photography
- LIGHTING: Dramatic medieval torch lighting with golden/amber tones, rim lighting on armor
- EFFECTS: Metallic reflections on armor, torch glow, subtle dust particles, aged vignette
- DEPTH: Strong depth of field, background softly blurred
- QUALITY: Photorealistic medieval cinematic, premium collectible card finish
- AVOID: Real coats of arms, distorted face, modern elements, text errors, low quality, borders, frames`,

    "escola-de-magia": `Create a PREMIUM WIZARD MAGIC SCHOOL COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, facing forward, maximum person visibility
- KEEP FACE EXACTLY THE SAME, wise mysterious wizard expression
- COSTUME: Dark WIZARD ROBE with GREEN MAGICAL ACCENTS, intricate rune patterns (glowing), holding ornate GLOWING WAND, magical jewelry
- BACKGROUND: Magical school library/tower setting with floating books, arcane symbols, mystical green/purple energy flows, magical atmosphere
- CARD STYLE: Clean edges, no border, magical glow effect, premium enchanted photography
- LIGHTING: Dramatic magical lighting with green/purple glows, wand glow, rim lighting with magical aura
- EFFECTS: Glowing runes, magical sparkles, arcane symbols floating, mystical fog, lens flares, energy flows
- DEPTH: Strong depth of field, background mystical blur
- QUALITY: Photorealistic cinematic magic quality, premium collectible finish
- AVOID: Real magical systems, distorted face, text errors, inconsistent magic style, low resolution, borders, frames`,

    "baby-hero": `Create a PREMIUM YOUNG SUPERHERO COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, centered, maximum person visibility
- KEEP FACE EXACTLY THE SAME, young confident heroic expression
- COSTUME: Colorful SUPERHERO COSTUME with VIBRANT CAPE (flowing), comic-book inspired design, bold colors, hero emblem on chest (generic)
- BACKGROUND: Bright comic-book style cityscape with dynamic energy, explosions, action effects, vibrant colors
- CARD STYLE: Clean edges, no border, action-packed appearance, glossy premium finish, comic-book photography
- LIGHTING: Bright dramatic cinematic lighting with colorful accents, dynamic rim lighting
- EFFECTS: Energy bursts, action lines, comic-book halftone effects, sparkles, dynamic motion
- DEPTH: Medium depth, vibrant background with action
- QUALITY: Comic-book cinematic quality, fun premium collectible finish
- AVOID: Real superhero franchises, distorted face, muddy colors, text errors, low quality, borders, frames`,

    "family-pack": `Create a PREMIUM FAMILY PORTRAIT COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, warm portrait composition, maximum person visibility
- KEEP FACE EXACTLY THE SAME, warm genuine smile, approachable family expression
- STYLING: Casual comfortable family-appropriate clothing, warm neutral colors, inviting appearance
- BACKGROUND: Warm golden-hour outdoor setting, soft natural lighting, family-friendly nature background with bokeh, warm atmosphere
- CARD STYLE: Clean edges, no border, warm family card aesthetic, premium family photography finish
- LIGHTING: Golden hour natural lighting, soft warm key light, professional family portrait lighting
- EFFECTS: Warm bokeh background, soft rim lighting, golden color grading, gentle vignette
- DEPTH: Shallow professional depth of field, background warmly blurred
- QUALITY: Premium family photography quality, professional portrait level
- AVOID: Cold colors, distorted face, formal stiffness, text errors, low resolution, borders, frames`,

    "pet-star": `Create a PREMIUM REGAL PET STAR COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, regal centered composition, maximum visibility
- KEEP FACE EXACTLY THE SAME, dignified proud regal expression
- STYLING: GOLDEN CROWN (ornate, jeweled), regal elegant appearance, noble bearing
- BACKGROUND: Luxurious VELVET THRONE setting, deep jewel tones (purple/gold), royal palace environment, dramatic regal backdrop
- CARD STYLE: Clean edges, no border, luxurious premium finish, regal photography
- LIGHTING: Dramatic regal lighting with golden spotlight, rich jewel-tone glow, rim lighting effect
- EFFECTS: Crown sparkles, gem reflections, spotlight effects, royal aura, velvet texture effects
- DEPTH: Strong depth of field, regal background softly blurred
- QUALITY: Photorealistic regal cinematic, luxury collectible card finish
- AVOID: Cheap-looking crown, distorted face, dark muddy tones, text errors, low quality, borders, frames`,

    "battle-card": `Create a PREMIUM BATTLE WARRIOR COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, action-ready pose, maximum person visibility
- KEEP FACE EXACTLY THE SAME, intense focused battle expression
- COSTUME: Professional COMBAT GEAR (battle-ready, armor/tactical), confident powerful stance, battle-ready appearance
- BACKGROUND: Dark BATTLE ARENA with lightning effects, storm clouds, dark dramatic atmosphere, epic battle environment
- CARD STYLE: Clean edges, no border, battle-action aesthetic, premium action photography
- LIGHTING: Dramatic cinematic battle lighting with lightning flashes, electric blue glow, rim lighting on figure
- EFFECTS: Lightning bolts, electricity arcs, battle dust/smoke, action energy, dramatic shadows
- DEPTH: Strong depth of field, atmospheric background
- QUALITY: Photorealistic cinematic action quality, premium battle card finish
- AVOID: Real military marks, distorted face, unclear lighting, text errors, low resolution, borders, frames`,

    "avatar-poster": `Create a PREMIUM CINEMATIC AVATAR POSTER COLLECTIBLE CARD.
CRITICAL REQUIREMENTS:
- Vertical orientation, aspect ratio 2:3 (1024x1536)
- FILL ENTIRE FRAME: face to shoulders visible, cinematic poster composition, maximum person visibility
- KEEP FACE EXACTLY THE SAME, iconic mysterious avatar expression
- STYLING: Futuristic AVATAR styling, cyberpunk-inspired elements, digital-organic fusion, mysterious appearance
- BACKGROUND: Cinematic CYBERPUNK CITY ENVIRONMENT with neon lights, digital overlays, technological atmosphere, electric energy effects
- CARD STYLE: Clean edges, no border, movie poster appearance, premium digital photography
- LIGHTING: Dramatic cinematic neon lighting with electric blues/purples, digital glow, rim lighting
- EFFECTS: Neon glows, digital artifacts, holographic effects, energy flows, cyberpunk atmosphere, lens flares
- DEPTH: Strong cinematic depth of field, futuristic background with depth
- QUALITY: Cinematic movie poster quality, premium collectible card finish
- AVOID: Real brand logos, distorted face, muddy neon, text errors, low resolution, borders, frames`,
  };

  return prompts[theme] ?? `Create a premium collectible card portrait of ${nome}. Photorealistic quality, professional card aesthetic.`;
}

// ── PROMPT VARIATIONS FOR MULTIPLE GENERATIONS ──────────────────────────────
function getPromptVariation(basePrompt: string, variationIndex: number, theme: string): string {
  // Different variations for different themes
  if (theme === "futebol-2026") {
    const variations = [
      // Variation 1: Original
      basePrompt,
      
      // Variation 2: Different lighting mood
      basePrompt.replace("Dramatic cinematic lighting with golden highlights and green glow", "Warm sunset lighting with orange and gold tones, stadium floodlights in background"),
      
      // Variation 3: Different pose (NO BORDERS)
      basePrompt.replace("facing camera directly", "slight three-quarter angle with confident side glance").replace("Clean edges, no border", "Clean edges, absolutely no borders or frames, seamless background integration"),
      
      // Variation 4: Different background atmosphere
      basePrompt.replace("Dark green stadium atmosphere", "Vibrant green stadium with crowd silhouettes and celebration atmosphere"),
      
      // Variation 5: Different effects
      basePrompt.replace("Sparkles, lens flares, subtle smoke", "Golden particle effects, stadium lights, victory celebration sparkles"),
      
      // Variation 6: Action pose
      basePrompt.replace("shoulders to chest visible", "shoulders to chest visible in dynamic action stance, as if celebrating a goal"),
      
      // Variation 7: Different lighting style
      basePrompt.replace("Dramatic cinematic lighting", "Stadium spotlight lighting with dramatic shadows and rim lighting"),
      
      // Variation 8: Different expression
      basePrompt.replace("confident expression", "victorious celebration expression with intense joy"),
      
      // Variation 9: Different jersey details
      basePrompt.replace("NUMBER 10 on chest", "NUMBER 10 on chest with captain's armband and Brazil flag patch"),
      
      // Variation 10: Different finish
      basePrompt.replace("glossy sports card finish", "premium holographic finish with rainbow reflections and metallic sheen"),
    ];
    return variations[variationIndex % variations.length];
  }
  
  if (theme === "futebol-panini") {
    const variations = [
      // Variation 1: Original
      basePrompt,
      
      // Variation 2: Different background color
      basePrompt.replace("vibrant turquoise/teal color (#00B4A6)", "deep ocean blue background with teal gradient effects"),
      
      // Variation 3: Different pose
      basePrompt.replace("front-facing professional football player portrait", "dynamic three-quarter view with confident side look"),
      
      // Variation 4: Different jersey style
      basePrompt.replace("bright yellow and green Brazil-inspired football jersey", "vibrant emerald green and golden yellow Brazilian jersey with modern design"),
      
      // Variation 5: Different numbers
      basePrompt.replace('large oversized green rounded numbers "26"', 'stylized metallic gold numbers "26" with shadow effects'),
      
      // Variation 6: Action stance
      basePrompt.replace("from chest up", "from chest up in ready-to-play stance with determined expression"),
      
      // Variation 7: Different lighting
      basePrompt.replace("studio lighting", "professional sports photography lighting with soft shadows"),
      
      // Variation 8: Different expression
      basePrompt.replace("confident expression", "focused game-ready expression with intense determination"),
      
      // Variation 9: Different background elements
      basePrompt.replace("turquoise/teal color", "gradient turquoise background with subtle geometric patterns"),
      
      // Variation 10: Different finish
      basePrompt.replace("premium glossy sticker finish", "premium matte finish with selective holographic highlights"),
    ];
    return variations[variationIndex % variations.length];
  }
  
  // Default variations for other themes
  const variations = [
    basePrompt,
    basePrompt.replace("studio lighting", "dramatic cinematic lighting"),
    basePrompt.replace("confident expression", "determined focused expression"),
    basePrompt + " Enhanced detail focus on textures and realism.",
  ];
  
  return variations[variationIndex % variations.length];
}

// ── FLUX SCHNELL: Generate image from detailed prompt ──────────────────────
async function generateWithFluxSchnell(input: GenerateImageInput, customPrompt?: string): Promise<GenerateImageResult> {
  const prompt = customPrompt || getDetailedPrompt(input.theme, input.formData);

  console.log(`🎨 FLUX Schnell generating image for theme: ${input.theme}...`);
  const output = await replicate.run(
    "black-forest-labs/flux-schnell",
    {
      input: {
        prompt,
        output_format: "jpg",
        num_outputs: 1,
      },
    }
  );

  const imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
  console.log(`✅ FLUX Schnell returned image URL`);
  return { imageUrl, promptUsed: prompt, isMock: false };
}

// ── FLUX KONTEXT PRO: Edits the real photo, preserves face ───────────────────
async function generateWithKontext(input: GenerateImageInput, customPrompt?: string): Promise<GenerateImageResult> {
  const prompt = customPrompt || getDetailedPrompt(input.theme, input.formData);

  const output = await replicate.run(
    "black-forest-labs/flux-kontext-pro",
    {
      input: {
        prompt,
        input_image: input.uploadedImageBase64,
        output_format: "jpg",
        output_quality: 95,
        safety_tolerance: 2,
        // No aspect_ratio — let FLUX generate full image without crop
      },
    }
  );

  const imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
  return { imageUrl, promptUsed: prompt, isMock: false };
}

// ── FLUX 1.1 PRO: High quality generation from prompt (no photo) ─────────────
async function generateWithFluxPro(input: GenerateImageInput): Promise<GenerateImageResult> {
  const prompt = getDetailedPrompt(input.theme, input.formData);

  const output = await replicate.run(
    "black-forest-labs/flux-1.1-pro",
    {
      input: {
        prompt,
        output_format: "jpg",
        output_quality: 95,
        safety_tolerance: 2,
        // No aspect_ratio — let FLUX generate full image without crop
      },
    }
  );

  const imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
  return { imageUrl, promptUsed: prompt, isMock: false };
}

// ── MOCK FALLBACK ─────────────────────────────────────────────────────────────
// SVG data URIs with base64 encoding for better browser compatibility
const MOCK_IMAGES: Record<string, string> = {
  "futebol-2026":        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMDY0RTNCJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjRkJCRjI0JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+RlVURUJPTCAyMDI2PC90ZXh0Pjwvc3ZnPg==",
  "futebol-panini":      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMDBCNEE2JyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjRkZGRkZGJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+UEFOSU5JIFNUWUxFPC90ZXh0Pjwvc3ZnPg==",
  "hero-card":           "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMUUxQjRCJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjN0MzQUVEJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+SEVSP0NB1JQiPC90ZXh0Pjwvc3ZnPg==",
  "profissional-premium":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMUUyOTNCJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjMjU2M0VCJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+UFJPJ0VTU0lPTkFMPC90ZXh0Pjwvc3ZnPg==",
  "reino-medieval":      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjNDMxNDA3JyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjRkJCRjI0JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+UkVJTk8gTUVESUVWQUw8L3RleHQ+PC9zdmc+",
  "escola-de-magia":     "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMkUxMDY1JyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjQTc4QkZBJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+RVNDT0xBIERFIE1BR0lBPC90ZXh0Pjwvc3ZnPg==",
  "baby-hero":           "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjODMxODQzJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjRjlBOEQ0JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+QkFCWSBIRVJPPC90ZXh0Pjwvc3ZnPg==",
  "family-pack":         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMEYzNDYwJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjMzhCREY4JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+RkFNSUxZIFBBQ0s8L3RleHQ+PC9zdmc+",
  "pet-star":            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjNDMxNDA3JyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjRkNEMzREJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+UEVUIFNUQVI8L3RleHQ+PC9zdmc+",
  "battle-card":         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjN0YxRDFEJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjRjk3MzE2JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+QkFUVExFIENBUkQ8L3RleHQ+PC9zdmc+",
  "avatar-poster":       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNzY4Jz48cmVjdCBmaWxsPScjMEYxNzJBJyB3aWR0aD0nNTEyJyBoZWlnaHQ9Jzc2OCcvPjx0ZXh0IHg9JzI1NicgeT0nMzg0JyBmb250LXNpemU9JzQ4JyBmaWxsPScjOEI1Q0Y2JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyBmb250LXdlaWdodD0nYm9sZCc+QVZBVEFSMPC90ZXh0Pjwvc3ZnPg==",
};

// ── MULTIPLE IMAGE GENERATION WITH TEMPLATE DISTRIBUTION ────────────────────
export async function generateMultipleCollectibleImages(
  input: GenerateImageInput
): Promise<GenerateMultipleImagesResult> {
  const versions = input.versions || 1;
  console.log(`🚀 Starting generation of ${versions} image(s) for theme: ${input.theme}...`);
  
  const results: GenerateImageResult[] = [];
  
  // Special handling for football themes - distribute between templates
  const shouldDistributeFootballTemplates = (input.theme === "futebol-2026" || input.theme === "futebol-panini") && versions >= 5;
  
  for (let i = 0; i < versions; i++) {
    console.log(`📸 Generating image ${i + 1}/${versions}...`);
    
    try {
      let prompt: string;
      let currentTheme = input.theme;
      
      // Distribute football templates: 3 futebol-2026 + 2 futebol-panini
      if (shouldDistributeFootballTemplates) {
        if (i < 3) {
          currentTheme = "futebol-2026";
          console.log(`🏆 Using futebol-2026 template for image ${i + 1}`);
        } else {
          currentTheme = "futebol-panini";
          console.log(`🎯 Using futebol-panini template for image ${i + 1}`);
        }
      }
      
      // Generate base prompt
      if (input.uploadedImageBase64) {
        try {
          prompt = await generateCustomizedPrompt(input.uploadedImageBase64, currentTheme, input.formData);
          console.log(`✅ Custom prompt generated for image ${i + 1}`);
        } catch (anthropicErr) {
          console.error(`❌ Error generating custom prompt for image ${i + 1}, using default.`, anthropicErr);
          prompt = getDetailedPrompt(currentTheme, input.formData);
        }
      } else {
        prompt = getDetailedPrompt(currentTheme, input.formData);
      }
      
      // Apply variation if not the first image
      if (i > 0) {
        prompt = getPromptVariation(prompt, i, currentTheme);
        console.log(`🎨 Applied variation ${i} to prompt for theme ${currentTheme}`);
      }
      
      // Generate image
      let result: GenerateImageResult;
      if (input.uploadedImageBase64) {
        result = await generateWithKontext({ 
          ...input, 
          theme: input.theme, 
          formData: input.formData, 
          uploadedImageBase64: input.uploadedImageBase64 
        }, prompt);
      } else {
        result = await generateWithFluxSchnell({ 
          ...input, 
          theme: input.theme, 
          formData: input.formData 
        }, prompt);
      }
      
      // Add template information
      result.templateUsed = currentTheme;
      
      results.push(result);
      console.log(`✅ Image ${i + 1}/${versions} generated successfully`);
      
      // Small delay between generations to avoid rate limits
      if (i < versions - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (err) {
      console.error(`⚠️ Failed to generate image ${i + 1}:`, err);
      
      // Add fallback mock image
      const fallbackPrompt = getDetailedPrompt(input.theme, input.formData);
      results.push({
        imageUrl: MOCK_IMAGES[input.theme] ?? MOCK_IMAGES["hero-card"],
        promptUsed: fallbackPrompt,
        isMock: true,
      });
    }
  }
  
  console.log(`🎉 Generated ${results.length}/${versions} images successfully`);
  return {
    images: results,
    totalGenerated: results.length,
  };
}

// ── MAIN EXPORT (SINGLE IMAGE) ───────────────────────────────────────────────
export async function generateCollectibleImage(
  input: GenerateImageInput
): Promise<GenerateImageResult> {
  // PREVIEW: FLUX Schnell with detailed prompts
  // After payment: pode usar FLUX Kontext Pro para edição de foto

  console.log(`🚀 Starting image generation for theme: ${input.theme}...`);

  let prompt: string;
  try {
    // Se houver foto, gera prompt personalizado com Anthropic
    if (input.uploadedImageBase64) {
      try {
        prompt = await generateCustomizedPrompt(input.uploadedImageBase64, input.theme, input.formData);
        console.log("✅ Prompt personalizado gerado pela Anthropic");
      } catch (anthropicErr) {
        console.error("❌ Erro ao gerar prompt com Anthropic, usando prompt padrão.", anthropicErr);
        prompt = getDetailedPrompt(input.theme, input.formData);
      }
    } else {
      prompt = getDetailedPrompt(input.theme, input.formData);
    }

    // Gera imagem usando o prompt (personalizado ou padrão)
    // Se houver foto, usa o modelo que aceita input_image
    let result: GenerateImageResult;
    if (input.uploadedImageBase64) {
      result = await generateWithKontext({ ...input, theme: input.theme, formData: input.formData, uploadedImageBase64: input.uploadedImageBase64 });
      // Sobrescreve o promptUsed para mostrar o prompt real usado
      result.promptUsed = prompt;
    } else {
      // Sem foto, usa o modelo normal
      result = await generateWithFluxSchnell({ ...input, theme: input.theme, formData: input.formData });
      result.promptUsed = prompt;
    }
    console.log(`✅ Image generated successfully`);
    return result;
  } catch (err) {
    console.error(`⚠️ Geração de imagem falhou:`, err);
    // Fallback para mock SVG se tudo falhar
    prompt = getDetailedPrompt(input.theme, input.formData);
    console.log(`📦 Using mock fallback`);
    return {
      imageUrl: MOCK_IMAGES[input.theme] ?? MOCK_IMAGES["hero-card"],
      promptUsed: prompt,
      isMock: true,
    };
  }
}
