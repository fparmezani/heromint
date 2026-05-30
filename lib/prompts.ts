export interface PromptInput {
  theme: string;
  formData: Record<string, string>;
}

const BASE_PROMPT = `Transform the person in the photo into a premium digital collectible card.
Preserve the main facial features of the person.
Create a vertical image 1024x1536 pixels.
Epic, cinematic, gamer and collectible style.
Avoid registered trademarks, real logos or known fictional characters.
All texts must be legible.
The result must look like a premium commercial product.`;

export function generatePrompt({ theme, formData }: PromptInput): string {
  const prompts: Record<string, string> = {
    "futebol-2026": `${BASE_PROMPT}
Theme: Professional football player card for a world championship.
Style: Gold and green borders with holographic effects, player stats panel.
Player data: Name: ${formData.nome}, Country: ${formData.pais}, Team: ${formData.time}, Position: ${formData.posicao}, Height: ${formData.altura}cm, Weight: ${formData.peso}kg.
The card should show the player in a stadium atmosphere with dramatic lighting.`,

    "hero-card": `${BASE_PROMPT}
Theme: Epic fantasy hero trading card.
Style: Dark fantasy with glowing runes, ornate borders, power indicators.
Hero data: Name: ${formData.nome}, Class: ${formData.classe}, Power: ${formData.poderPrincipal}, Rarity: ${formData.raridade}.
Quote on card: "${formData.fraseCurta}"
The card should show the hero in an epic battle pose with dramatic lighting.`,

    "profissional-premium": `${BASE_PROMPT}
Theme: Premium professional business card in collector style.
Style: Modern, sleek dark background with blue/purple accents, corporate but premium.
Professional data: Name: ${formData.nome}, Position: ${formData.cargo}, Specialty: ${formData.especialidade}, Stack: ${formData.stackPrincipal}.
Quote: "${formData.fraseProfissional}"
The card should convey authority and innovation.`,

    "reino-medieval": `${BASE_PROMPT}
Theme: Medieval fantasy kingdom character card.
Style: Ancient parchment textures with golden ornaments, coat of arms, runes.
Character data: Name: ${formData.nome}, Kingdom: ${formData.reino}, Class: ${formData.classe}, Weapon: ${formData.arma}, Power: ${formData.poder}.
The character should be dressed in full medieval armor/robes.`,

    "escola-de-magia": `${BASE_PROMPT}
Theme: Magic school student collector card.
Style: Mystical with stars, spell effects, house crest, magical borders.
Mage data: Name: ${formData.nome}, House: ${formData.casaFicticia}, Power: ${formData.poder}, Guide Animal: ${formData.animalGuia}, Level: ${formData.nivelMagico}.
The card should glow with magical energy effects.`,

    "baby-hero": `${BASE_PROMPT}
Theme: Cute baby superhero collector card.
Style: Colorful, playful, comic-book style with bright colors and cute effects.
Baby hero data: Name: ${formData.nomeCrianca}, Age: ${formData.idade} years old, Superpower: ${formData.poderFofo}.
Quote: "${formData.fraseCurta}"
The card should be adorable yet epic, with cape and hero elements.`,

    "family-pack": `${BASE_PROMPT}
Theme: Epic family team collector card.
Style: Warm gold tones, family crest, heroic team composition layout.
Family data: Family name: ${formData.nomeFamilia}, Members: ${formData.membrosFamilia}, Year: ${formData.ano}.
Motto: "${formData.fraseFamilia}"
Show the family as an epic hero team.`,

    "pet-star": `${BASE_PROMPT}
Theme: Epic pet star collector card.
Style: Fun and dramatic, star effects, spotlight, pet statistics panel.
Pet data: Name: ${formData.nomePet}, Type: ${formData.tipo}, Personality: ${formData.personalidade}, Superpower: ${formData.poderFicticio}.
The pet should look majestic and powerful in an epic setting.`,

    "battle-card": `${BASE_PROMPT}
Theme: Epic battle versus collector card.
Style: Split design, fire and lightning effects, battle arena background, VS logo.
Battle data: Player 1: ${formData.nomeJogador1} vs Rival: ${formData.nomeRival}, Battle style: ${formData.estiloBatalha}, Main power: ${formData.poderPrincipal}.
Dramatic confrontation pose with energy effects.`,

    "avatar-poster": `${BASE_PROMPT}
Theme: Cinematic avatar poster in ${formData.estiloVisual} style.
Style: Movie poster quality, dramatic lighting, ${formData.energiaPrincipal} energy effects.
Avatar data: Name: ${formData.nome}, Visual style: ${formData.estiloVisual}, Energy: ${formData.energiaPrincipal}.
Quote: "${formData.fraseCurta}"
Full body hero shot with epic background appropriate to the style.`,
  };

  return prompts[theme] ?? `${BASE_PROMPT}\nTheme: ${theme}\nData: ${JSON.stringify(formData)}`;
}
