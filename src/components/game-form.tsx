'use client';

import { useEffect, useState, useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GameContext } from '@/context/game-provider';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title: z.string().min(2, { message: 'El título debe tener al menos 2 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  category: z.string().min(2, { message: 'La categoría es obligatoria.' }),
  price: z.coerce.number().min(0, { message: 'El precio no puede ser negativo.' }),
  imageUrl: z.string().url({ message: 'Por favor, introduce una URL de imagen válida.' }),
  pcRequirements: z.object({
    os: z.string().optional(),
    processor: z.string().optional(),
    memory: z.string().optional(),
    graphics: z.string().optional(),
    storage: z.string().optional(),
  }),
});

type GameFormValues = z.infer<typeof formSchema>;

interface GameFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  game?: Game;
}

export function GameForm({ isOpen, setIsOpen, game }: GameFormProps) {
  const { games, addGame, updateGame } = useContext(GameContext);

  const allCategories = useMemo(() => {
    const categoriesSet = new Set(games.map((g) => g.category));
    return Array.from(categoriesSet).sort();
  }, [games]);

  const defaultValues = useMemo(() => {
    return {
      title: game?.title || '',
      description: game?.description || '',
      category: game?.category || '',
      price: game?.price || 0,
      imageUrl: game?.imageUrl || 'https://placehold.co/600x400.png',
      pcRequirements: {
        os: game?.pcRequirements?.os || '',
        processor: game?.pcRequirements?.processor || '',
        memory: game?.pcRequirements?.memory || '',
        graphics: game?.pcRequirements?.graphics || '',
        storage: game?.pcRequirements?.storage || '',
      },
    };
  }, [game]);

  const form = useForm<GameFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [game, isOpen, form, defaultValues]);

  const onSubmit = async (data: GameFormValues) => {
    if (game) {
      await updateGame({ id: game.id, ...data });
    } else {
      await addGame(data);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{game ? 'Editar Juego' : 'Añadir Nuevo Juego'}</DialogTitle>
          <DialogDescription>
            {game ? 'Actualiza los detalles del juego.' : 'Rellena los detalles del nuevo juego.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Elden Ring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el juego..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe o selecciona una categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(allCategories.length > 0) && (
              <div className="space-y-2 pt-1">
                <FormLabel className="text-sm text-muted-foreground">Categorías existentes:</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                      <Badge 
                          key={category} 
                          variant={form.watch('category') === category ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => form.setValue('category', category, { shouldValidate: true })}
                      >
                          {category}
                      </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 59.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la Imagen</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <h4 className="font-semibold text-foreground">Requisitos de PC</h4>

             <FormField
              control={form.control}
              name="pcRequirements.os"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Operativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Windows 10 64-bit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="pcRequirements.processor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procesador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Intel Core i7-6700" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="pcRequirements.memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 16 GB RAM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="pcRequirements.graphics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gráficos</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: NVIDIA GeForce GTX 1060" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="pcRequirements.storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Almacenamiento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 70 GB de espacio disponible" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {game ? 'Guardar Cambios' : 'Añadir Juego'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
