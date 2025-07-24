import React from "react";

interface GoldenBadgeProps {
  gottyValue: number | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const GoldenBadge: React.FC<GoldenBadgeProps> = ({ 
  gottyValue, 
  size = "md", 
  className = "" 
}) => {
  // Tamaños configurables con padding ajustado
  const sizeClasses = {
    sm: "w-16 h-16 text-xs pt-1",  // pt-1 para padding-top pequeño
    md: "w-24 h-24 text-lg pt-2",   // pt-2 para padding-top medio
    lg: "w-32 h-32 text-xl pt-3",   // pt-3 para padding-top grande
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Contenedor principal */}
      <div
        className={`${sizeClasses[size]} rounded-full flex flex-col items-center justify-start 
        border-2 border-yellow-300 transform rotate-12 shadow-lg
        bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600
        animate-[pulse_3s_infinite]`}
      >
        {/* Efecto de relieve */}
        <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-yellow-200 opacity-60"></div>
        
        {/* Contenido del badge con padding superior */}
        <div className="flex flex-col items-center transform -rotate-12 z-10 pt-2">
          <span className="font-bold text-fuchsia-800 tracking-wider pt-3">
            GOTY
          </span>
          <span className="font-bold text-yellow-900 text-lg">
            {gottyValue}
          </span>
        </div>
        
        {/* Efectos de brillo */}
        <div className="absolute top-3 left-6 w-5 h-5 bg-yellow-200 rounded-full blur-sm animate-[pulse_2s_infinite]"></div>
        <div className="absolute bottom-4 right-5 w-4 h-4 bg-yellow-300 rounded-full blur-sm animate-[pulse_3s_infinite_1s]"></div>
      </div>
      
      {/* Efecto de resplandor exterior */}
      <div 
        className={`absolute inset-0 ${sizeClasses[size].split(' ')[0]} rounded-full 
        bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 blur-md -z-10 
        animate-[pulse_4s_infinite_0.5s]`}
      ></div>
    </div>
  );
};

export default GoldenBadge;