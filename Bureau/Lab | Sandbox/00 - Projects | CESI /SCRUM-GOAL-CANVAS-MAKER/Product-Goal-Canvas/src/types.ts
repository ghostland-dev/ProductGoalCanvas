export interface CanvasSection {
  title: string;
  subtitle?: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface ProductGoalCanvas {
  projectTitle: string;
  objectifDuProduit: CanvasSection;
  vision: CanvasSection;
  description: CanvasSection;
  resultatsEtMesures: CanvasSection;
  partiesPrenantes: CanvasSection;
  risques: CanvasSection;
  equipeScrum: CanvasSection;
}

export type ExportFormat = 'pdf' | 'png' | 'svg';