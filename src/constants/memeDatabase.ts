/**
 * Meme Database - Portuguese/Brazilian Viral Memes
 * 
 * Each meme has:
 * - id: unique identifier
 * - name: Display name in Portuguese
 * - expressions: Array of expressions it matches
 * - url: URL to image/video (can be local or Cloudinary)
 * - type: 'image' or 'video'
 * - category: Theme/category of the meme
 * - description: Short description
 */

export interface Meme {
  id: string;
  name: string;
  expressions: string[];
  url: string;
  type: 'image' | 'video';
  category: 'clássico' | 'viral' | 'novo';
  description: string;
}

export const MEME_DATABASE: Meme[] = [
  {
    id: 'neutral',
    name: '😐 Neutro',
    expressions: ['neutral'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'clássico',
    description: 'Expressão neutra, sem muita reação',
  },
  {
    id: 'neutral_smile',
    name: '😊 Sorriso Natural',
    expressions: ['neutral_smile'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'clássico',
    description: 'Um sorriso simples e natural',
  },
  {
    id: 'cachorro_piada',
    name: '🐕 Cachorro Fazendo Piada',
    expressions: ['smile'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'viral',
    description: 'Aquele sorriso de quem acabou de fazer uma piada',
  },
  {
    id: 'nazare_confusa',
    name: '😕 Nazaré Confusa',
    expressions: ['surprise', 'confused'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'clássico',
    description: 'A famosa expressão confusa de Nazaré Tedesco',
  },
  {
    id: 'confused',
    name: '🤔 Confuso',
    expressions: ['confused'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'viral',
    description: 'Expressão de quem não percebeu nada',
  },
  {
    id: 'shocked',
    name: '😮 Chocado',
    expressions: ['shocked'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'viral',
    description: 'A cara de quem levou um susto',
  },
  {
    id: 'surprised',
    name: '😲 Surpreso',
    expressions: ['surprised'],
    url: '/memes/placeholder.svg',
    type: 'image',
    category: 'viral',
    description: 'A sobrancelha levantada de quem não acreditou',
  },
];

/**
 * Get meme by ID
 */
export function getMemeById(id: string): Meme | undefined {
  return MEME_DATABASE.find((meme) => meme.id === id);
}

/**
 * Get meme by expression
 */
export function getMemeByExpression(expression: string): Meme | undefined {
  return MEME_DATABASE.find((meme) =>
    meme.expressions.includes(expression)
  );
}

/**
 * Get all memes of a category
 */
export function getMemesByCategory(category: string): Meme[] {
  return MEME_DATABASE.filter((meme) => meme.category === category);
}

/**
 * Get random meme
 */
export function getRandomMeme(): Meme {
  return MEME_DATABASE[Math.floor(Math.random() * MEME_DATABASE.length)];
}
