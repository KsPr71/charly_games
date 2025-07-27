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
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-fuchsia-500 hover:bg-fuchsia-700 text-white shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
            title="Subir al inicio"
            aria-label="Subir al inicio de la página"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
} 