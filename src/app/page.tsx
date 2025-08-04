"use client";

import { useState, useMemo, useContext, useRef, useEffect } from "react";
import { GameCard } from "@/components/game-card";
import { CategoryFilters } from "@/components/category-filters";
import { GameContext } from "@/context/game-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { GameDetailsDialog } from "@/components/game-details-dialog";
import type { Game } from "@/lib/types";
import "../app/globals.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCarousel from "../components/ui/category-carousel";
import { Search } from "lucide-react";
import Image from "next/image";
import { getTopRatedGames } from "../components/topRated";
import type { TopRatedGame } from "@/lib/types";
import WhatsAppFloatingButton from "@/components/ui/botonW";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { ContactProvider } from "../context/ContactContext";
import { useContact } from "../context/ContactContext";
import { ProgressBar } from "@/components/ui/progress-bar";
import TrueFocus from '@/components/ui/TrueFocus';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchGames } from "@/app/utils/supabase/client";

const PAGE_SIZE = 50;

export default function Home() {
  const { games, isLoading,} = useContext(GameContext);
  const [progress, setProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { contactInfo, loading } = useContact();

const recentGames = useMemo(() => {
  return [...games]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15);
}, [games]);

  const categories = useMemo(() => {
    const allCategories = games.map((game) => game.category);
    return ["Todos", ...Array.from(new Set(allCategories))];
  }, [games]);

  const filteredGames = useMemo(() => {
    const byCategory =
      selectedCategory === "Todos"
        ? games
        : games.filter((game) => game.category === selectedCategory);

    return byCategory.filter((game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [games, selectedCategory, searchTerm]);

  const [topGames, setTopGames] = useState<any[]>([]);

  const refreshTopRated = () => {
    getTopRatedGames(5).then(setTopGames);
  };

  useEffect(() => {
    getTopRatedGames(10).then(setTopGames);
  }, []);

  // Estados para infinite scroll
  const [exploreGames, setExploreGames] = useState<Game[]>([]);
  const [explorePage, setExplorePage] = useState(0);
  const [exploreHasMore, setExploreHasMore] = useState(true);

  const loadMoreExploreGames = async () => {
    const newGames = await fetchGames({ 
      limit: PAGE_SIZE, 
      offset: explorePage * PAGE_SIZE,
      category: selectedCategory 
    });
    setExploreGames(prev => [...prev, ...newGames]);
    setExploreHasMore(newGames.length === PAGE_SIZE);
    setExplorePage(prev => prev + 1);
  };

  useEffect(() => {
    loadMoreExploreGames();
  }, []);

  // Resetear y cargar nuevos juegos cuando cambie la categoría
  useEffect(() => {
    setExploreGames([]);
    setExplorePage(0);
    setExploreHasMore(true);
    loadMoreExploreGames();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100">
<ProgressBar 
  isLoading={isLoading} 
  progress={progress} 
/>
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        {/* Imagen base */}
        <div className="relative w-full h-[400px] overflow-hidden">
          {/* Imagen fondo */}
          <Image
            src="/baner.png"
            alt="Banner principal"
            fill
            className="object-cover object-center lg:object-top opacity-0 transition-opacity duration-1000 delay-300 ease-in-out"
            onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
            priority
          />

          {/* Imagen encima */}
          <Image
            src="https://ticudnzjewvqmrgagntg.supabase.co/storage/v1/object/public/datos/icon.png" 
            alt="Banner encima"
            width={150}
            height={150}
            className="absolute top-35 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-1000 delay-300 ease-in-out"
            onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
          />
          
                     {/* TrueFocus en la parte inferior del banner */}
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
             <TrueFocus 
               sentence="CHARLY GAMES"
               manualMode={false}
               blurAmount={5}
               borderColor="fuchsia"
               animationDuration={2}
               pauseBetweenAnimations={1}
               textColor="white"
               fontSize="2rem"
             />
           </div>
        </div>
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold font-headline py-5">
            VIDEOJUEGOS
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Explora nuestra colección de juegos para PC.
          </p>
        </div>

        {isLoading ? (

          
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-6" />
            <div className="flex space-x-6 overflow-visible">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0"
                >
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
        ) : (
          recentGames.length > 0 && (
            <div className="mb-12 flex flex-col items-center">
              <h2 className="mb-6 text-3xl font-bold text-center font-headline">
                Lo más reciente
              </h2>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {recentGames.map((game) => (
                    <CarouselItem
                      key={game.id}
                      className="p-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div className="p-3">
                        <GameCard
                          game={game}
                          onCardClick={() => setSelectedGame(game)}
                          onVote={refreshTopRated}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          )
        )}

        <Separator className="my-12" />
        {topGames.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-6 font-headline">
              Top Mejor Valorados
            </h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {topGames.map((top: any) => (
                  <CarouselItem
                    key={(top as any).id}
                    className="p-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform relative">
                      <div className="relative w-full aspect-[3/2] mb-3 rounded overflow-hidden">
                        <Image
                          src={(top as any).image_url}
                          alt={`Portada de ${(top as any).title}`}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-center">
                        {(top as any).title}
                      </h3>
                      <div className="flex justify-center mt-2 space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const filled = i < Math.round((top as any).average_rating);
                          return (
                            <span
                              key={i}
                              className={`text-xl ${
                                filled ? "text-yellow-500" : "text-gray-300"
                              }`}
                            >
                              {filled ? "★" : "☆"}
                            </span>
                          );
                        })}
                      </div>
                      
                      {/* Promedio en la esquina inferior derecha */}
                      <div className="absolute bottom-2 right-2 bg-fuchsia-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        {(top as any).average_rating?.toFixed(1) || "0.0"}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        )}

        <h2 className="mb-8 text-3xl font-bold text-center font-headline">
          Explorar todo
        </h2>
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
              showSearchInput
                ? "w-48 opacity-100"
                : "w-0 opacity-0 overflow-hidden"
            }`}
          />

          <style jsx>{`
            @keyframes bounceSlow {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-4px);
              }
            }

            .animate-bounce-slow {
              animation: bounceSlow 1s infinite;
            }
          `}</style>
        </div>

        <div className="fixed bottom-4 right-4 z-50 p-3 md:p-4">
          <WhatsAppFloatingButton />
        </div>
        
        <ScrollToTop />

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
        ) : (
          <InfiniteScroll
            dataLength={exploreGames.length}
            next={loadMoreExploreGames}
            hasMore={exploreHasMore}
            loader={<h4 className="text-center py-4">Cargando más juegos...</h4>}
            endMessage={<p className="text-center py-4 text-muted-foreground">No hay más juegos</p>}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {exploreGames
                .filter((game) =>
                  (selectedCategory === "Todos" || game.category === selectedCategory) &&
                  game.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((game, index) => (
                  <GameCard
                    key={`explore-${game.id}-${index}`}
                    game={game}
                    onCardClick={() => setSelectedGame(game)}
                    onVote={refreshTopRated}
                  />
                ))}
            </div>
          </InfiniteScroll>
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
