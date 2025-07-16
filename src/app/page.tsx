'use client';

import { useState, useMemo, useContext, useRef } from 'react';
import { GameCard } from '@/components/game-card';
import { CategoryFilters } from '@/components/category-filters';
import { GameContext } from '@/context/game-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { GameDetailsDialog } from '@/components/game-details-dialog';
import type { Game } from '@/lib/types';
import "../app/globals.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import  CategoryCarousel  from '../components/ui/category-carousel';
import { Search } from "lucide-react";
import  Image  from 'next/image';




import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { games, isLoading } = useContext(GameContext);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
const [showSearchInput, setShowSearchInput] = useState(false);

  const recentGames = useMemo(() => {
    return games.slice(0, 5);
  }, [games]);

  const categories = useMemo(() => {
    const allCategories = games.map((game) => game.category);
    return ['Todos', ...Array.from(new Set(allCategories))];
  }, [games]);

const filteredGames = useMemo(() => {
  const byCategory = selectedCategory === 'Todos'
    ? games
    : games.filter((game) => game.category === selectedCategory);

  return byCategory.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [games, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 bg-gray-100">



  {/* Imagen base */}
<div className="relative w-full h-[400px] overflow-hidden">
  {/* Imagen fondo */}
  <Image
    src="/baner.png"
    alt="Banner principal"
    fill
    className="object-cover object-center lg:object-top opacity-0 transition-opacity duration-1000 delay-300 ease-in-out"
    onLoadingComplete={(img) => img.classList.remove('opacity-0')}
    priority
  />

  {/* Imagen encima */}
  <Image
    src="/logo1.png"
    alt="Banner encima"
    width={200}
    height={200}
    className="absolute top-40 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-1000 delay-300 ease-in-out"
    onLoadingComplete={(img) => img.classList.remove('opacity-0')}
  />
</div>
        <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold font-headline py-5">CATÁLOGO DE JUEGOS</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Explora nuestra colección de juegos para PC.
            </p>
        </div>

        {isLoading ? (
            <div className="mb-12">
                <Skeleton className="h-8 w-48 mx-auto mb-6" />
                <div className="flex space-x-6 overflow-visible">
                    {Array.from({ length: 3 }).map((_, index) => (
                         <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0">
                            <div className="flex flex-col space-y-3">
                                <Skeleton className="h-[200px] w-full rounded-lg" />
                                <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
        ) : recentGames.length > 0 && (
          <div className="mb-12 flex flex-col items-center">
            <h2 className="mb-6 text-3xl font-bold text-center font-headline">Lo más reciente</h2>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {recentGames.map((game) => (
                  <CarouselItem key={game.id} className="p-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-3">
                      <GameCard game={game} onCardClick={() => setSelectedGame(game)} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        )}
        
        <Separator className="my-12" />

        <h2 className="mb-8 text-3xl font-bold text-center font-headline">Explorar todo</h2>
<div className="w-full overflow-x-auto">
<CategoryCarousel
  categories={categories}
  selectedCategory={selectedCategory}
  onSelectCategory={setSelectedCategory}
/>
</div>
<div className="fixed top-20 right-6 z-50 flex items-center">
  {/* Botón redondo con lupa */}
  <button
    onClick={() => setShowSearchInput(!showSearchInput)}
    className="p-2 rounded-full bg-fuchsia-500 hover:bg-fuchsia-700 text-white shadow-lg text-sm italic transition transform active:scale-90 animate-bounce-slow"
    title="Buscar juego por nombre"
  >
    <Search className="h-4 w-4" />
  </button>

  {/* Campo de búsqueda expandible */}
  <input
    type="text"
    placeholder="Buscar por nombre..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onBlur={() => setShowSearchInput(false)}
    className={`ml-3 transition-all duration-300 ease-in-out text-sm italic p-2 rounded-md bg-white border border-gray-300 shadow-sm ${
      showSearchInput ? 'w-48 opacity-100' : 'w-0 opacity-0 overflow-hidden'
    }`}
  />

  <style jsx>{`
    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .animate-bounce-slow {
      animation: bounceSlow 1s infinite;
    }
  `}</style>
</div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} onCardClick={() => setSelectedGame(game)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-xl text-muted-foreground">No se encontraron juegos en esta categoría.</p>
          </div>
        )}
      </div>

      <GameDetailsDialog
        game={selectedGame}
        isOpen={!!selectedGame}
        setIsOpen={(isOpen) => {
          if (!isOpen) {
            setSelectedGame(null);
          }
        }}
      />
    </div>
  );
}
