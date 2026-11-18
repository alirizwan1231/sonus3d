export type Variant = {
  name: string;
  shell: string;
  band: string;
  accent: string;
  cushion: string;
  price: number;
};

export const VARIANTS: Variant[] = [
  { name: "Onyx Black", shell: "#1B1C21", band: "#101114", accent: "#FF5A1F", cushion: "#131316", price: 349 },
  { name: "Ivory Cream", shell: "#E9E3D5", band: "#DCD3BF", accent: "#B9862F", cushion: "#2A251D", price: 349 },
  { name: "Crimson", shell: "#8E1F2F", band: "#671220", accent: "#FFB3A0", cushion: "#1D0C10", price: 369 },
  { name: "Ocean Depth", shell: "#14406B", band: "#0C2A47", accent: "#3EC1FF", cushion: "#0A141F", price: 369 },
];

/** Mutable bridge between the React UI and the Three.js render loop. */
export const stage = {
  progress: 0, // 0..1 scroll progress through the sticky stage
  variant: 0,
  explodeTarget: 0, // 0 assembled, 1 exploded
  yawTarget: 0, // extra rotation from view presets
  pitchTarget: 0,
};
