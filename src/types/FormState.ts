export type ImplementationType = "HTML" | "TAILWIND";

export interface FormState {
  title: string;
  category: string;
  implementation: ImplementationType;

  html: string;
  css: string;
  js: string;

  tailwind: string;
}