"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, SortAsc } from "lucide-react";

export type SortOption = "default" | "alphabetical" | "release_asc" | "release_desc" | "year_asc" | "year_desc";

interface SortButtonsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortButtons({ currentSort, onSortChange }: SortButtonsProps) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm">
      <div className="text-sm font-bold text-purple-700 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        Ordenar por:
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Ordenamiento general */}
                 <Button
           variant={currentSort === "default" ? "default" : "outline"}
           size="sm"
           onClick={() => onSortChange("default")}
           className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
             currentSort === "default" 
               ? "bg-blue-600 text-white shadow-md" 
               : "hover:bg-blue-50 hover:border-blue-300"
           }`}
         >
           <ArrowUpDown className={`h-4 w-4 transition-transform duration-300 ${
             currentSort === "default" ? "animate-spin" : "hover:rotate-180"
           }`} />
           Predeterminado
         </Button>

         {/* Ordenamiento alfabético */}
         <Button
           variant={currentSort === "alphabetical" ? "default" : "outline"}
           size="sm"
           onClick={() => onSortChange("alphabetical")}
           className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
             currentSort === "alphabetical" 
               ? "bg-blue-600 text-white shadow-md" 
               : "hover:bg-blue-50 hover:border-blue-300"
           }`}
         >
           <SortAsc className={`h-4 w-4 transition-transform duration-300 ${
             currentSort === "alphabetical" ? "animate-bounce" : "hover:scale-110"
           }`} />
           Alfabético
         </Button>

         {/* Ordenamiento por fecha de creación */}
         <Button
           variant={currentSort === "release_asc" ? "default" : "outline"}
           size="sm"
           onClick={() => onSortChange("release_asc")}
           className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
             currentSort === "release_asc" 
               ? "bg-blue-600 text-white shadow-md" 
               : "hover:bg-blue-50 hover:border-blue-300"
           }`}
         >
           <ArrowUp className={`h-4 w-4 transition-transform duration-300 ${
             currentSort === "release_asc" ? "animate-bounce" : "hover:-translate-y-1"
           }`} />
           Más Antiguos
         </Button>

         <Button
           variant={currentSort === "release_desc" ? "default" : "outline"}
           size="sm"
           onClick={() => onSortChange("release_desc")}
           className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
             currentSort === "release_desc" 
               ? "bg-blue-600 text-white shadow-md" 
               : "hover:bg-blue-50 hover:border-blue-300"
           }`}
         >
           <ArrowDown className={`h-4 w-4 transition-transform duration-300 ${
             currentSort === "release_desc" ? "animate-bounce" : "hover:translate-y-1"
           }`} />
           Más Recientes
         </Button>

         {/* Ordenamiento por año de lanzamiento */}
         <Button
           variant={currentSort === "year_asc" ? "default" : "outline"}
           size="sm"
           onClick={() => onSortChange("year_asc")}
           className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
             currentSort === "year_asc" 
               ? "bg-blue-600 text-white shadow-md" 
               : "hover:bg-blue-50 hover:border-blue-300"
           }`}
         >
           <ArrowUp className={`h-4 w-4 transition-transform duration-300 ${
             currentSort === "year_asc" ? "animate-pulse" : "hover:-translate-y-1"
           }`} />
           Año ↑
         </Button>

         <Button
           variant={currentSort === "year_desc" ? "default" : "outline"}
           size="sm"
           onClick={() => onSortChange("year_desc")}
           className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
             currentSort === "year_desc" 
               ? "bg-blue-600 text-white shadow-md" 
               : "hover:bg-blue-50 hover:border-blue-300"
           }`}
         >
           <ArrowDown className={`h-4 w-4 transition-transform duration-300 ${
             currentSort === "year_desc" ? "animate-pulse" : "hover:translate-y-1"
           }`} />
           Año ↓
         </Button>
      </div>
    </div>
  );
} 