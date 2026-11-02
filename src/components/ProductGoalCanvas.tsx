import React, { useState, useRef } from 'react';
import { Download, FileImage, File as FilePdf, Heart } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import { CanvasSection } from './CanvasSection';
import type { ProductGoalCanvas as ProductGoalCanvasType, ExportFormat } from '../types';

const initialCanvas: ProductGoalCanvasType = {
  projectTitle: '',
  objectifDuProduit: {
    title: 'Objectif du Produit (#2)',
    subtitle: 'Que voulez-vous réaliser (et pour quand) ?',
    content: ''
  },
  vision: {
    title: 'Vision (#1)',
    subtitle: "Quelle est l'image plus large, pour laquelle l'Objectif du Produit est un tremplin ?",
    content: ''
  },
  description: {
    title: 'Description (#3)',
    subtitle: "Décrivez le narratif derrière l'Objectif du Produit",
    content: ''
  },
  resultatsEtMesures: {
    title: 'Résultats Précieux & Mesures (#4)',
    subtitle: "Si nous atteignons l'Objectif du Produit, quel résultat précieux le produit générera-t-il ?",
    content: ''
  },
  partiesPrenantes: {
    title: 'Parties Prenantes (#5)',
    subsections: [
      { title: 'Utilisateur', content: '' },
      { title: 'Influenceur', content: '' },
      { title: 'Fournisseur', content: '' },
      { title: 'Gouvernance Interne', content: '' },
      { title: 'Gouvernance Externe', content: '' }
    ]
  },
  risques: {
    title: 'Risques (#6)',
    subtitle: 'Quels sont les risques dont nous sommes conscients et quelles choses craignons-nous ?',
    content: ''
  },
  equipeScrum: {
    title: 'Équipe Scrum (#7)',
    subsections: [
      { title: 'Product Owner', content: '' },
      { title: 'Développeurs', content: '' },
      { title: 'Scrum Master', content: '' }
    ]
  }
};

export function ProductGoalCanvas() {
  const [canvas, setCanvas] = useState<ProductGoalCanvasType>(initialCanvas);
  const canvasRef = useRef<HTMLDivElement>(null);

  const updateSection = (key: keyof ProductGoalCanvasType, content: string, subsectionIndex?: number) => {
    setCanvas((prev) => {
      if (key === 'projectTitle') {
        return { ...prev, projectTitle: content };
      }

      const section = { ...prev[key] };
      
      if (typeof subsectionIndex === 'number' && section.subsections) {
        section.subsections = section.subsections.map((subsection, index) =>
          index === subsectionIndex ? { ...subsection, content } : subsection
        );
      } else {
        section.content = content;
      }

      return { ...prev, [key]: section };
    });
  };

  const exportCanvas = async (format: ExportFormat) => {
    if (!canvasRef.current) return;

    try {
      switch (format) {
        case 'png':
          const pngData = await toPng(canvasRef.current, { quality: 0.95 });
          downloadFile(pngData, 'product-goal-canvas.png');
          break;

        case 'svg':
          const svgData = await toSvg(canvasRef.current);
          downloadFile(svgData, 'product-goal-canvas.svg');
          break;

        case 'pdf':
          const pdfImageData = await toPng(canvasRef.current, { quality: 0.95 });
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(pdfImageData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(pdfImageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('product-goal-canvas.pdf');
          break;
      }
    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDonation = () => {
    window.open('https://www.buymeacoffee.com/ismailmouyahada', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col gap-8 mb-12">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                Product Goal Canvas
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Définissez et documentez vos objectifs produit
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du Projet
              </label>
              <input
                type="text"
                id="projectTitle"
                value={canvas.projectTitle}
                onChange={(e) => updateSection('projectTitle', e.target.value)}
                placeholder="Entrez le titre de votre projet..."
                className="w-full px-4 py-3 text-xl font-semibold text-gray-800 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => exportCanvas('pdf')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FilePdf size={20} />
                <span>PDF</span>
              </button>
              <button
                onClick={() => exportCanvas('png')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FileImage size={20} />
                <span>PNG</span>
              </button>
              <button
                onClick={() => exportCanvas('svg')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download size={20} />
                <span>SVG</span>
              </button>
            </div>
          </div>

          <div 
            ref={canvasRef} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {Object.entries(canvas).filter(([key]) => key !== 'projectTitle').map(([key, section]) => (
              <CanvasSection
                key={key}
                section={section}
                onChange={(content, subsectionIndex) => 
                  updateSection(key as keyof ProductGoalCanvasType, content, subsectionIndex)
                }
              />
            ))}
          </div>
        </div>

        <footer className="text-center py-8">
          <button
            onClick={handleDonation}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-md hover:shadow-lg mb-6"
          >
            <Heart size={20} className="animate-pulse" />
            <span>Soutenez ce projet</span>
          </button>
          <p className="text-gray-600 text-sm">
            Développé avec ❤️ par Ismail MOUYAHADA
          </p>
        </footer>
      </div>
    </div>
  );
}