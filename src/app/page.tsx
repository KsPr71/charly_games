'use client';

import { useState, useMemo, useContext } from 'react';
import { GameCard } from '@/components/game-card';
import { CategoryFilters } from '@/components/category-filters';
import { GameContext } from '@/context/game-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { GameDetailsDialog } from '@/components/game-details-dialog';
import type { Game } from '@/lib/types';
import "../app/globals.css";


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

  const recentGames = useMemo(() => {
    return games.slice(0, 5);
  }, [games]);

  const categories = useMemo(() => {
    const allCategories = games.map((game) => game.category);
    return ['Todos', ...Array.from(new Set(allCategories))];
  }, [games]);

  const filteredGames = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return games;
    }
    return games.filter((game) => game.category === selectedCategory);
  }, [games, selectedCategory]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold font-headline">CATÁLOGO DE JUEGOS</h1>
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
        <CategoryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

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
    </>
  );
}
