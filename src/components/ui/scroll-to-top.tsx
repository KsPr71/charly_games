"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando el usuario haya scrolleado 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll suave al inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 left-4 z-50 p-3 md:p-4">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 animate-color-change"
            title="Subir al inicio"
            aria-label="Subir al inicio de la página"
            style={{
              backgroundImage: 'linear-gradient(45deg, #c026d3, #a855f7, #9333ea, #7c3aed, #8b5cf6, #a855f7, #c084fc, #d946ef)',
              backgroundSize: '400% 400%',
              animation: 'colorChange 3s ease-in-out infinite',
            }}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          
          <style jsx>{`
            @keyframes colorChange {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            
            .animate-color-change:hover {
              animation-duration: 1s;
              filter: brightness(1.1);
            }
          `}</style>
        </div>
      )}
    </>
  );
} 