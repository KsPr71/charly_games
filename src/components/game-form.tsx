"use client";

import { useEffect, useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GameContext } from "@/context/game-provider";
import type { Game } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  price: z.coerce.number().min(0),
  imageUrl: z.string().url(),
  os: z.string().optional(),
  processor: z.string().optional(),
  memory: z.string().optional(),
  graphics: z.string().optional(),
  storage: z.string().optional(),
});
type GameFormValues = z.infer<typeof formSchema>;

interface GameFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  game?: Game;
}

export function GameForm({ isOpen, setIsOpen, game }: GameFormProps) {
  const { games, addGame, updateGame } = useContext(GameContext);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (game?.imageUrl) {
      setPreviewUrl(game.imageUrl);
    }
  }, [game]);

  const allCategories = useMemo(() => {
    const categoriesSet = new Set(games.map((g) => g.category));
    return Array.from(categoriesSet).sort();
  }, [games]);

  const defaultValues: GameFormValues = useMemo(
    () => ({
      title: game?.title ?? "",
      description: game?.description ?? "",
      category: game?.category ?? "",
      price: game?.price ?? 0,
      imageUrl: game?.imageUrl ?? "",
      os: game?.os ?? "",
      processor: game?.processor ?? "",
      memory: game?.memory ?? "",
      graphics: game?.graphics ?? "",
      storage: game?.storage ?? "",
    }),
    [game]
  );

  const form = useForm<GameFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("game-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data, error: urlError } = supabase.storage
      .from("game-images")
      .getPublicUrl(filePath);

    if (urlError || !data?.publicUrl)
      throw new Error("No se pudo obtener la URL pública");

    return data.publicUrl;
  };

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
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto bg-background px-6 py-4 rounded-xl shadow-lg border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {game ? "Editar Juego" : "Añadir Nuevo Juego"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {game
              ? "Actualiza los detalles del juego."
              : "Rellena los detalles del nuevo juego."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="general" className="w-full space-y-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="tech">Requisitos Técnicos</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input className="rounded-md" {...field} />
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
                        <Textarea className="rounded-md" {...field} />
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
                        <Input className="rounded-md" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {allCategories.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <FormLabel className="text-sm text-muted-foreground">
                      Categorías existentes:
                    </FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            form.watch("category") === category
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer transition hover:scale-105"
                          onClick={() =>
                            form.setValue("category", category, {
                              shouldValidate: true,
                            })
                          }
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
                          <Input
                            type="number"
                            step="0.01"
                            className="rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={() => (
                      <FormItem>
                        <FormLabel>Imagen del juego</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {previewUrl && (
                              <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="rounded-md border w-full object-cover max-h-48"
                              />
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 5_000_000) {
                                  console.error("Archivo muy pesado (>5MB)");
                                  return;
                                }
                                try {
                                  const publicUrl = await handleImageUpload(
                                    file
                                  );
                                  form.setValue("imageUrl", publicUrl, {
                                    shouldValidate: true,
                                  });
                                  setPreviewUrl(publicUrl);
                                } catch (error) {
                                  console.error(
                                    "Error al subir la imagen:",
                                    error
                                  );
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="tech" className="space-y-4">
                {["os", "processor", "memory", "graphics", "storage"].map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof GameFormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fieldName.charAt(0).toUpperCase() +
                              fieldName.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input className="rounded-md" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-4 flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
  type="submit"
  disabled={form.formState.isSubmitting}
  className={`flex items-center gap-2 transition ${
    form.formState.isSubmitting
      ? 'animate-pulse bg-[#e63946] text-white'
      : 'bg-[#1d3557] text-white hover:opacity-80'
  }`}
>
  {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
  {game ? "Guardar Cambios" : "Añadir Juego"}
</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
