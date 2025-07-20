"use client";

import Image from "next/image";
import type { Game } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Gamepad2,
  ShoppingCart,
} from "lucide-react";

interface GameDetailsDialogProps {
  game: Game | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function GameDetailsDialog({
  game,
  isOpen,
  setIsOpen,
}: GameDetailsDialogProps) {
  if (!game) return null;

  const whatsappNumber = "+5352708602";
  const message = encodeURIComponent(
    `Hola! Me interesa el juego ${game.title}. ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* 1. DialogHeader con título (SOLO UNO) */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold px-6 pt-4">
            {game.title}
          </DialogTitle>
          <DialogDescription className="px-6">
            {game.description}
          </DialogDescription>
        </DialogHeader>

        {/* 2. Imagen (fuera del Header) */}
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={game.imageUrl}
            alt={`Cover art for ${game.title}`}
            fill
            className="rounded-t-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* 3. Contenido principal */}
        <div className="p-6 pt-4">
          <Badge
            variant="secondary"
            className="mb-2 w-fit bg-gray-200 ml-auto shadow-sm border border-gray-400"
          >
            {game.category}
          </Badge>

          <Separator className="my-6" />

          {/* Requisitos del juego */}
          <div className="border-l border-r border-gray-300 bg-gray-100 rounded-md p-1">
            <h4 className="mb-4 text-xl font-semibold text-foreground">
              Requisitos Mínimos
            </h4>
            <ul className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              {/* ... (tus elementos de requisitos) ... */}
            </ul>
          </div>

          <Separator className="my-6" />

          {/* Botón de cierre */}
          <DialogClose asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-red-500 hover:bg-red-700 text-white shadow-md transition transform hover:scale-105 active:scale-95"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>

          {/* Footer */}
          <DialogFooter className="mt-8 flex-col items-end sm:flex-row sm:justify-end gap-4">
            {/* ... (tu footer actual) ... */}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
