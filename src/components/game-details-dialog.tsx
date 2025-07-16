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
  if (!game) {
    return null;
  }

  const whatsappNumber = "+5352708602";
  const message = encodeURIComponent(
    `Hola! Me interesa el juego ${game.title}. ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <style jsx>{`
  [data-dialog-close],
  button[aria-label='Close'] {
    display: none;
  }
`}</style>
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
          <Badge
            variant="secondary"
            className="mb-2 w-fit bg-gray-200 ml-auto shadow-sm border border-gray-400"
          >
            {game.category}
          </Badge>
          <DialogTitle className="mb-2 text-3xl font-bold font-headline">
            {game.title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground ">
            {game.description}
          </DialogDescription>

          <Separator className="my-6" />

          <div className="border-l border-r border-gray-300 bg-gray-100 rounded-md p-1">
            <h4 className="mb-4 text-xl font-semibold text-foreground">
              Requisitos Mínimos
            </h4>
            <ul className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <Cpu size={20} className="mt-1 flex-shrink-0 text-primary" />{" "}
                <div>
                  <strong>Sistema Operativo:</strong>
                  <br /> {game.os || "No especificado"}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Gamepad2
                  size={20}
                  className="mt-1 flex-shrink-0 text-primary"
                />{" "}
                <div>
                  <strong>Procesador:</strong>
                  <br /> {game.processor || "No especificado"}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MemoryStick
                  size={20}
                  className="mt-1 flex-shrink-0 text-primary"
                />{" "}
                <div>
                  <strong>Memoria:</strong>
                  <br /> {game.memory || "No especificado"}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Monitor
                  size={20}
                  className="mt-1 flex-shrink-0 text-primary"
                />{" "}
                <div>
                  <strong>Gráficos:</strong>
                  <br /> {game.graphics || "No especificado"}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <HardDrive
                  size={20}
                  className="mt-1 flex-shrink-0 text-primary"
                />{" "}
                <div>
                  <strong>Almacenamiento:</strong>
                  <br /> {game.storage || "No especificado"}
                </div>
              </li>
            </ul>
          </div>
          <Separator className="my-6" />

          <DialogClose asChild>
  <button
    className="absolute top-4 right-4 p-2 rounded-full bg-red-500 hover:bg-red-700 text-white shadow-md transition transform hover:scale-105 active:scale-95"
    aria-label="Cerrar"
  >
    <X className="h-4 w-4" />
  </button>
</DialogClose>

          
<DialogFooter className="mt-8 flex-col items-end sm:flex-row sm:justify-end gap-4">
<div className="flex flex-col items-end gap-3 mt-6 sm:items-end sm:gap-4 sm:flex-row sm:justify-between">
  {/* Texto de tamaño de archivo */}
  <div className="text-sm text-muted-foreground font-medium sm:text-base">
    Tamaño del archivo: {game.weight} GB
  </div>

  {/* Precio destacado */}
  <div className="text-4xl font-extrabold text-blue-700 sm:text-5xl sm:ml-auto">
    {game.price > 0 ? `$${game.price.toFixed(2)}` : "Gratis"}
  </div>

  {/* Botón de WhatsApp */}
  <Button
    asChild
    size="sm"
    className="px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 shadow-md transition-all ml-auto sm:ml-0"
  >
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <ShoppingCart className="mr-2 h-4 w-4" />
      WhatsApp
    </a>
  </Button>
</div>

</DialogFooter>

        </div>
      </DialogContent>
    </Dialog>
  );
}
