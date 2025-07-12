'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Game } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Cpu, MemoryStick, HardDrive, Monitor, Gamepad2, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';


interface GameCardProps {
  game: Game;
  onCardClick: () => void;
}

export function GameCard({ game, onCardClick }: GameCardProps) {
  const whatsappNumber = '+5352708602';
  const message = encodeURIComponent(`Hola! Me interesa el juego ${game.title}. ¿Podrían darme más información?`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <Card 
      className="flex h-full transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div onClick={onCardClick} className="cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={game.imageUrl}
              alt={`Cover art for ${game.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              data-ai-hint={`${game.category.toLowerCase()} game`}
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-grow flex-col p-4 pb-2">
          <Badge variant="secondary" className="mb-2 w-fit">{game.category}</Badge>
          <CardTitle className="mb-2 text-xl font-bold font-headline">{game.title}</CardTitle>
          <CardDescription className="mb-4 line-clamp-3 flex-grow text-sm">{game.description}</CardDescription>
        </CardContent>
      </div>

      <CardFooter className="flex-col items-stretch p-4 pt-0">
         <Accordion type="single" collapsible onValueChange={(value) => setIsAccordionOpen(!!value)}>
            <AccordionItem value="requirements" className="border-b-0">
                <AccordionTrigger className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 hover:no-underline">
                     <span>Ver Requisitos</span>
                     <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isAccordionOpen && "rotate-180")} />
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-sm">
                   <ul className="space-y-3">
                    <li className="flex items-start gap-3"><Cpu size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>SO:</strong> {game.pcRequirements?.os || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><Gamepad2 size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Procesador:</strong> {game.pcRequirements?.processor || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><MemoryStick size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Memoria:</strong> {game.pcRequirements?.memory || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><Monitor size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Gráficos:</strong> {game.pcRequirements?.graphics || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><HardDrive size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Almacenamiento:</strong> {game.pcRequirements?.storage || 'N/A'}</div></li>
                   </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
         <p className="mt-auto mb-4 mt-4 text-2xl font-semibold text-primary">
            {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}
         </p>
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={(e) => e.stopPropagation()}>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pedir por WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
