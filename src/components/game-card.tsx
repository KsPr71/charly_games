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
      className="flex h-full transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-white relative z-0"
    >
      <div onClick={onCardClick} className="cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
<img
  src={game.imageUrl}
  alt={game.title}
  width={600}
  height={400}
  className="rounded-md object-cover"
/>
<img
  src="https://ticudnzjewvqmrgagntg.supabase.co/storage/v1/object/public/game-images/1752448072732.webp"
  alt="Prueba de imagen"
  className="rounded-md w-full"
/>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-grow flex-col p-4 pb-2">
          <Badge variant="secondary" className="mb-2 w-fit bg-gray-200">{game.category}</Badge>
          <CardTitle className="mb-2 text-xl font-bold font-headline">{game.title}</CardTitle>
          <CardDescription className="mb-4 line-clamp-3 flex-grow text-sm">{game.description}</CardDescription>
        </CardContent>
      </div>

      <CardFooter className="flex-col items-stretch p-4 pt-0">
         <Accordion type="single" collapsible onValueChange={(value) => setIsAccordionOpen(!!value)}>
            <AccordionItem value="requirements" className="border-l border-r border-gray-300 bg-gray-100 rounded-md p-1">
                <AccordionTrigger className="flex w-full justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 hover:no-underline">
                     <span>Ver Requisitos</span>
                     
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-sm">
                   <ul className="space-y-3">
                    <li className="flex items-start gap-3"><Cpu size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>SO:</strong> {game.os || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><Gamepad2 size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Procesador:</strong> {game.processor || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><MemoryStick size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Memoria:</strong> {game.memory || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><Monitor size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Gráficos:</strong> {game.graphics || 'N/A'}</div></li>
                    <li className="flex items-start gap-3"><HardDrive size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Almacenamiento:</strong> {game.storage || 'N/A'}</div></li>
                   </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
         <p className="mt-auto mb-4 mt-4 text-2xl font-semibold text-blue-900 p-4">
            {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}
         </p>
<Button
  asChild
  className="w-full px-4 py-2 rounded-lg font-semibold bg-fuchsia-700 text-white hover:bg-fuchsia-900 transition-colors duration-200 shadow-md hover:shadow-lg"
  onClick={(e) => e.stopPropagation()}
>
  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
    <ShoppingCart className="mr-2 h-4 w-4" />
    Pedir por WhatsApp
  </a>
</Button>
      </CardFooter>
    </Card>
  );
}
