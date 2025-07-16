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

  return (
    <div className="relative flex items-center justify-center mb-6">
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

  {categories.map((category) => (
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
  );
}
export default CategoryCarousel;