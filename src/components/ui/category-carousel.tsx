import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

function CategoryCarousel({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  // Separar "Todos" del resto de categorías
  const allCategories = categories.filter(cat => cat === "Todos");
  const otherCategories = categories.filter(cat => cat !== "Todos");

  return (
    <div className="mb-6">
      {/* Botón "Todos" siempre visible */}
      <div className="flex justify-center mb-4">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-6 py-3 rounded-full border text-base font-medium transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-lg"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Carousel para el resto de categorías */}
      <div className="relative flex items-center justify-center">
        {/* Flecha izquierda */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Carrusel de categorías */}
        <div
          ref={scrollRef}
          className="mx-8 flex gap-3 overflow-x-auto scroll-smooth px-4 py-2"
          style={{
            scrollbarWidth: "none",         // Firefox
            msOverflowStyle: "none",        // IE 10+
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {otherCategories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full border text-sm flex-shrink-0 whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600 font-semibold shadow"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Flecha derecha */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
export default CategoryCarousel;