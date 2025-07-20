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

import { useContact } from '../context/ContactContext'

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

  const { contactInfo, loading } = useContact()

 const whatsappNumber = contactInfo?.telefono || "5352708602"; // Reemplaza con tu número de WhatsApp;
  const message = encodeURIComponent(
    `Hola! Me interesa el juego ${game.title}. ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* 1. DialogHeader con título (SOLO UNO) */}
        <DialogHeader>
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={game.imageUrl}
            alt={`Cover art for ${game.title}`}
            fill
            className="rounded-t-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
          <DialogTitle className="text-3xl font-bold px-6 pt-4">
            {game.title}
          </DialogTitle>
          <DialogDescription className="px-6 text-lg text-muted-foreground">
            {game.description}
          </DialogDescription>
        </DialogHeader>

        {/* 2. Imagen (fuera del Header) */}

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
{/* Requisitos del juego */}
<div className="border-2 border-r border-gray-800 bg-gray-800 rounded-md p-4">
  <h4 className="mb-4 text-xl font-semibold text-foreground">
    Requisitos Mínimos
  </h4>

  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* Sección Sistema y Procesador */}
    <li className="flex items-start gap-3">
      <Cpu className="h-5 w-5 mt-0.5 text-primary" />
      <div className="space-y-2">
        <div>
          <p className="font-medium">Sistema Operativo</p>
          <p className="text-muted-foreground">{game.os || "No especificado"}</p>
        </div>
      </div>
       </li>
    <li className="flex items-start gap-3">
      <Cpu className="h-5 w-5 mt-0.5 text-primary" /> 
        <div>
          <p className="font-medium">Procesador</p>
          <p className="text-muted-foreground">{game.processor || "No especificado"}</p>
        </div>
    </li>

    {/* Memoria RAM */}
    <li className="flex items-start gap-3">
      <MemoryStick className="h-5 w-5 mt-0.5 text-primary" />
      <div>
        <p className="font-medium">Memoria RAM</p>
        <p className="text-muted-foreground">{game.memory || "No especificado"}</p>
      </div>
    </li>

    {/* Gráficos */}
    <li className="flex items-start gap-3">
      <Monitor className="h-5 w-5 mt-0.5 text-primary" />
      <div>
        <p className="font-medium">Gráficos</p>
        <p className="text-muted-foreground">{game.graphics || "No especificado"}</p>
      </div>
    </li>

    {/* Almacenamiento */}
    <li className="flex items-start gap-3">
      <HardDrive className="h-5 w-5 mt-0.5 text-primary" />
      <div>
        <p className="font-medium">Almacenamiento</p>
        <p className="text-muted-foreground">{game.storage || "No especificado"}</p>
      </div>
    </li>
  </ul>

</div>

<Separator className="my-6" />
<div>
<div className="flex justify-center"> {/* Contenedor principal centrado */}
  <div className="flex items-center gap-8 mt-6 p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
    {/* Tamaño del archivo */}
    <div className="flex items-center gap-3">
      <HardDrive className="h-6 w-6 text-blue-600" />
      <div>
        <p className="text-base text-gray-500">Tamaño</p>
        <p className="text-xl font-bold text-gray-800">{game.storage}</p>
      </div>
    </div>

    {/* Separador visual */}
    <div className="h-10 w-px bg-gray-300"></div>

    {/* Precio */}
    <div className="flex items-center gap-3">
      <span className="text-green-500 font-bold text-2xl">$</span>
      <div>
        <p className="text-base text-gray-500">Precio</p>
        <p className={`text-2xl font-bold ${game.price > 0 ? 'text-green-600' : 'text-purple-600'}`}>
          {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}
        </p>
      </div>
    </div>
  </div>
</div>
  <div>
            <Button
          asChild
          className="w-full px-4 py-2 rounded-lg font-semibold bg-fuchsia-700 text-white hover:bg-fuchsia-900 transition-colors duration-200 shadow-md hover:shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pedir por WhatsApp
          </a>
        </Button>
  </div>
</div>

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
