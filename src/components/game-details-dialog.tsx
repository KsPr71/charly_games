'use client';

import Image from 'next/image';
import type { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Cpu, MemoryStick, HardDrive, Monitor, Gamepad2, ShoppingCart } from 'lucide-react';

interface GameDetailsDialogProps {
  game: Game | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function GameDetailsDialog({ game, isOpen, setIsOpen }: GameDetailsDialogProps) {
  if (!game) {
    return null;
  }

  const whatsappNumber = '+5352708602';
  const message = encodeURIComponent(`Hola! Me interesa el juego ${game.title}. ¿Podrían darme más información?`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-0">
          <div className="relative h-64 w-full sm:h-80">
            <Image
              src={game.imageUrl}
              alt={`Cover art for ${game.title}`}
              fill
              className="rounded-t-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </DialogHeader>
        <div className="p-6 pt-4">
          <Badge variant="secondary" className="mb-2 w-fit">{game.category}</Badge>
          <DialogTitle className="mb-2 text-3xl font-bold font-headline">{game.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">{game.description}</DialogDescription>

          <Separator className="my-6" />

          <div>
            <h4 className="mb-4 text-xl font-semibold text-foreground">Requisitos Mínimos</h4>
            <ul className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-start gap-3"><Cpu size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Sistema Operativo:</strong><br/> {game.pcRequirements?.os || 'No especificado'}</div></li>
              <li className="flex items-start gap-3"><Gamepad2 size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Procesador:</strong><br/> {game.pcRequirements?.processor || 'No especificado'}</div></li>
              <li className="flex items-start gap-3"><MemoryStick size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Memoria:</strong><br/> {game.pcRequirements?.memory || 'No especificado'}</div></li>
              <li className="flex items-start gap-3"><Monitor size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Gráficos:</strong><br/> {game.pcRequirements?.graphics || 'No especificado'}</div></li>
              <li className="flex items-start gap-3"><HardDrive size={20} className="mt-1 flex-shrink-0 text-primary" /> <div><strong>Almacenamiento:</strong><br/> {game.pcRequirements?.storage || 'No especificado'}</div></li>
            </ul>
          </div>
          
          <DialogFooter className="mt-8 flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
             <p className="text-3xl font-bold text-primary sm:text-4xl">
              {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Pedir por WhatsApp
              </a>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
