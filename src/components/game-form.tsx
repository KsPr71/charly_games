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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { osOptions } from "../data/os-options";
import { processorOptions } from "../data/processor-options";
import { memoryOptions } from "../data/memory-options";
import { graphicsOptions } from "../data/graphics-options";
import { storageOptions } from "../data/storage-options";
import { categoryOptions } from "../data/category-options";

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
  weight: z.coerce.number().min(0).optional(),
});
type GameFormValues = z.infer<typeof formSchema>;

interface GameFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  game?: Game;
}

function usePriceRanges() {
  const [ranges, setRanges] = useState<
    { min: number; max: number; price: number }[]
  >([]);

  useEffect(() => {
    async function fetchRanges() {
      const { data, error } = await supabase
        .from("price")
        .select("min, max, price");

      if (!error && data) setRanges(data);
    }

    fetchRanges();
  }, []);

  return ranges;
}

export function GameForm({ isOpen, setIsOpen, game }: GameFormProps) {
  const { games, addGame, updateGame } = useContext(GameContext);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const ranges = usePriceRanges();

function calcularPrecio(weight: unknown): number {
  const peso = typeof weight === "string" ? Number(weight) : weight;

  if (!ranges.length || typeof peso !== "number" || isNaN(peso)) return 0;

  const rango = ranges.find((r) => peso >= r.min && peso <= r.max);
  return rango ? rango.price : 0;
}

  const defaultValues: GameFormValues = useMemo(
    () => ({
      title: game?.title ?? "",
      description: game?.description ?? "",
      category: game?.category ?? "",
      price: game?.price ?? calcularPrecio(game?.weight ?? 0),
      imageUrl: game?.imageUrl ?? "",
      os: game?.os ?? "",
      processor: game?.processor ?? "",
      memory: game?.memory ?? "",
      graphics: game?.graphics ?? "",
      storage: game?.storage ?? "",
      weight: game?.weight ?? 0,
    }),
    [game, ranges]
  );



  const form = useForm<GameFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const currentWeight = form.watch("weight");
  const estimatedPrice = calcularPrecio(currentWeight);

  useEffect(() => {
    if (
      typeof currentWeight === "number" &&
      !isNaN(currentWeight)
    ) {
      form.setValue("price", estimatedPrice, { shouldValidate: true });
    }
  }, [currentWeight, estimatedPrice, form]);

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (game?.imageUrl) {
      setPreviewUrl(game.imageUrl);
    }
  }, [game]);

useEffect(() => {
  const subscription = form.watch((value, { name }) => {
    if (
      name === "weight" &&
      typeof value.weight === "number" &&
      !isNaN(value.weight) &&
      ranges.length > 0
    ) {
      const rango = ranges.find(
        (r) =>
          typeof r.min === "number" &&
          typeof r.max === "number" &&
          value.weight >= r.min &&
          value.weight <= r.max
      );

      const precioCalculado = rango ? rango.price : 0;
      form.setValue("price", precioCalculado, { shouldValidate: true });
    }
  });

  return () => subscription.unsubscribe();
}, [form, ranges]);



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

  const allCategories = useMemo(() => {
    const categoriesSet = new Set(games.map((g) => g.category));
    return Array.from(categoriesSet).sort();
  }, [games]);

  const fieldLabels: Record<string, string> = {
    os: "Sistema Operativo",
    processor: "Procesador",
    memory: "Memoria RAM",
    graphics: "Tarjeta Gráfica",
    storage: "Almacenamiento",
    weight: "Tamaño (GB)",
  };

    const weightValue = form.watch("weight");
const precioCalculado = calcularPrecio(weightValue);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto bg-background px-6 py-4 rounded-xl shadow-lg border bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-fuchsia-800">
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
                <TabsTrigger
                  value="general"
                  className="px-4 py-2 rounded-md transition-colors duration-300 data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white bg-gray-200 text-gray-700"
                >
                  Información General
                </TabsTrigger>
                <TabsTrigger
                  value="tech"
                  className="px-4 py-2 rounded-md transition-colors duration-300 data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white bg-gray-200 text-gray-700"
                >
                  Requisitos Técnicos
                </TabsTrigger>
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
                        <select
                          {...field}
                          className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
                        >
                          <option value="">Seleccione una categoría</option>
                          {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
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

<FormField
  control={form.control}
  name="weight"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Tamaño</FormLabel>
      <FormControl>
        <Input
  type="number"
  min={0}
  step={1}
  value={form.watch("weight") ?? ""}
  onChange={(e) => {
    const valor = Number(e.target.value);
    form.setValue("weight", isNaN(valor) ? undefined : valor, { shouldValidate: true });
  }}
/>
      </FormControl>
      <FormMessage />
      {/* ✅ Vista del precio calculado */}
      <p className="text-sm text-muted-foreground mt-1">
        Precio estimado: ${precioCalculado.toFixed(2)}
      </p>
    </FormItem>
  )}
/>

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
                  (fieldName) => {
                    const optionsMap = {
                      os: osOptions,
                      processor: processorOptions,
                      memory: memoryOptions,
                      graphics: graphicsOptions,
                      storage: storageOptions,
                    };

                    const options =
                      optionsMap[fieldName as keyof typeof optionsMap];
                    const label = fieldLabels[fieldName];

                    return (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName as keyof GameFormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              {options ? (
                                <select
                                  {...field}
                                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
                                >
                                  <option value="">
                                    Seleccione una opción
                                  </option>
                                  {options.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <Input className="rounded-md" {...field} />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }
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
                    ? "animate-pulse bg-[#e63946] text-white"
                    : "bg-[#1d3557] text-white hover:opacity-80"
                }`}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {game ? "Guardar Cambios" : "Añadir Juego"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
