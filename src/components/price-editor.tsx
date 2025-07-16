import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export function PriceEditor() {
  const [ranges, setRanges] = useState([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    async function fetchPriceRanges() {
      const { data, error } = await supabase
        .from("price")
        .select("*")
        .order("min");
      if (!error && data) setRanges(data);
    }
    fetchPriceRanges();
  }, []);

  const handleInputChange = (id: number, field: string, value: number) => {
    setPendingUpdate((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id: number) => {
    const changes = pendingUpdate[id];
    if (!changes) return;

    const { error } = await supabase
      .from("price")
      .update(changes)
      .eq("id", id);

    if (!error) {
      setRanges((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...changes } : r))
      );
      setEditingId(null);
      setPendingUpdate((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDelete = async (id: number) => {
    await supabase.from("price").delete().eq("id", id);
    setRanges((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAdd = async () => {
    const newRow = { min: 0, max: 0, price: 0 };
    const { data, error } = await supabase.from("price").insert([newRow]).select();
    if (!error && data) {
      setRanges((prev) => [...prev, data[0]]);
    }
  };

  return (
    <Card className="shadow-md border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">
          Rangos de Precio
        </CardTitle>
        <CardDescription>
          Edita los rangos que definen el cálculo de precio automático por tamaño.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mínimo (GB)</TableHead>
              <TableHead>Máximo (GB)</TableHead>
              <TableHead>Precio ($)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranges.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  {editingId === r.id ? (
                    <Input
                      type="number"
                      defaultValue={r.min}
                      onChange={(e) =>
                        handleInputChange(r.id, "min", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  ) : (
                    <Badge variant="secondary">{r.min}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === r.id ? (
                    <Input
                      type="number"
                      defaultValue={r.max}
                      onChange={(e) =>
                        handleInputChange(r.id, "max", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  ) : (
                    <Badge variant="secondary">{r.max}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === r.id ? (
                    <Input
                      type="number"
                      defaultValue={r.price}
                      onChange={(e) =>
                        handleInputChange(r.id, "price", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  ) : (
                    <span className="font-semibold text-green-700">
                      ${r.price.toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editingId === r.id ? (
                    <Button size="sm" onClick={() => handleUpdate(r.id)}>
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(r.id)}
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(r.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleAdd} className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white">
            + Agregar nuevo rango
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
