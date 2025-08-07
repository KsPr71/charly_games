"use client";

import { SortButtons, type SortOption } from "@/components/sort-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings } from "lucide-react";

interface SortButtonsAccordionProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortButtonsAccordion({ currentSort, onSortChange }: SortButtonsAccordionProps) {
  // Función para obtener el texto del ordenamiento actual
  const getCurrentSortText = (sort: SortOption) => {
    switch (sort) {
      case "default":
        return "Predeterminado";
      case "alphabetical":
        return "Alfabético";
      case "release_asc":
        return "Más Antiguos";
      case "release_desc":
        return "Más Recientes";
      case "year_asc":
        return "Año ↑";
      case "year_desc":
        return "Año ↓";
      default:
        return "Predeterminado";
    }
  };

  return (
    <Accordion type="single" collapsible className="mb-6">
      <AccordionItem value="sort-options" className="border-0">
        <AccordionTrigger className="flex items-center gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm hover:no-underline hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
          <Settings className="h-5 w-5 text-purple-600" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-purple-700">
              Opciones de Ordenamiento
            </span>
            <span className="text-xs text-purple-500 font-medium">
              Actual: {getCurrentSortText(currentSort)}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <SortButtons 
            currentSort={currentSort} 
            onSortChange={onSortChange} 
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 