import React from 'react';
import { CanvasSection as CanvasSectionType } from '../types';
import { Bold, Italic, List } from 'lucide-react';

interface Props {
  section: CanvasSectionType;
  onChange: (content: string, subsectionIndex?: number) => void;
}

const formatText = (textArea: HTMLTextAreaElement, format: 'bold' | 'italic' | 'list') => {
  const start = textArea.selectionStart;
  const end = textArea.selectionEnd;
  const text = textArea.value;
  const selectedText = text.substring(start, end);

  let formattedText = '';
  let newCursorPos = end;

  switch (format) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      newCursorPos = start + formattedText.length;
      break;
    case 'italic':
      formattedText = `_${selectedText}_`;
      newCursorPos = start + formattedText.length;
      break;
    case 'list':
      formattedText = selectedText
        .split('\n')
        .map(line => line.trim() ? `• ${line}` : line)
        .join('\n');
      newCursorPos = start + formattedText.length;
      break;
  }

  const newText = text.substring(0, start) + formattedText + text.substring(end);
  return { newText, newCursorPos };
};

export function CanvasSection({ section, onChange }: Props) {
  const handleFormat = (
    e: React.MouseEvent,
    format: 'bold' | 'italic' | 'list',
    textArea: HTMLTextAreaElement,
    subsectionIndex?: number
  ) => {
    e.preventDefault();
    const { newText, newCursorPos } = formatText(textArea, format);
    onChange(newText, subsectionIndex);
    textArea.focus();
    textArea.setSelectionRange(newCursorPos, newCursorPos);
  };

  const renderFormatButtons = (textAreaId: string, subsectionIndex?: number) => (
    <div className="flex gap-2 mb-2">
      <button
        onClick={(e) => {
          const textArea = document.getElementById(textAreaId) as HTMLTextAreaElement;
          handleFormat(e, 'bold', textArea, subsectionIndex);
        }}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
        title="Gras"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={(e) => {
          const textArea = document.getElementById(textAreaId) as HTMLTextAreaElement;
          handleFormat(e, 'italic', textArea, subsectionIndex);
        }}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
        title="Italique"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={(e) => {
          const textArea = document.getElementById(textAreaId) as HTMLTextAreaElement;
          handleFormat(e, 'list', textArea, subsectionIndex);
        }}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
        title="Liste à puces"
      >
        <List size={16} />
      </button>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
        {section.subtitle && (
          <p className="text-sm text-gray-600 italic leading-relaxed">{section.subtitle}</p>
        )}
      </div>
      
      {section.subsections ? (
        <div className="space-y-6">
          {section.subsections.map((subsection, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-gray-800">{subsection.title}</h4>
              {renderFormatButtons(`subsection-${section.title}-${index}`, index)}
              <textarea
                id={`subsection-${section.title}-${index}`}
                className="w-full h-32 p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                value={subsection.content}
                onChange={(e) => onChange(e.target.value, index)}
                placeholder={`Entrez les détails pour ${subsection.title.toLowerCase()}...`}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {renderFormatButtons(`section-${section.title}`)}
          <textarea
            id={`section-${section.title}`}
            className="w-full h-48 p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
            value={section.content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Entrez les détails pour ${section.title.toLowerCase()}...`}
          />
        </>
      )}
    </div>
  );
}