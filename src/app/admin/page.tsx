"use client";

import { useState, useContext, useEffect } from "react";
import type { Game } from "@/lib/types";
import { GameContext } from "@/context/game-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GameForm } from "@/components/game-form";
import {
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  KeyRound,
  LogOut,
  ArrowUpDown,
  Mail,
  Users,
  Settings,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PriceEditor } from "@/components/price-editor";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

// Componente de formulario de autenticación con Supabase
function SupabaseAuth({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) throw authError;

      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", data.user?.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error("No tienes permisos de administrador");
      }

      onSuccess();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-sm shadow-md border border-slate-200 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-blue-800">
            <Lock className="h-5 w-5 text-blue-600" />
            Acceso Administrativo
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            Por favor, inicia sesión con tus credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-slate-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-slate-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPanel() {
  const { games, deleteGame, isLoading } = useContext(GameContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | undefined>(undefined);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Game;
    direction: "asc" | "desc";
  }>({
    key: "title",
    direction: "asc",
  });
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleAddNew = () => {
    setSelectedGame(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (game: Game) => {
    setSelectedGame(game);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (game: Game) => {
    console.log('Intentando eliminar juego:', game.title, 'ID:', game.id);
    setGameToDelete(game);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (gameToDelete) {
      try {
        await deleteGame(gameToDelete.id);
        setGameToDelete(null);
        console.log('Juego eliminado exitosamente:', gameToDelete.title);
      } catch (error) {
        console.error('Error al eliminar juego:', error);
        // Aquí podrías mostrar un toast o notificación de error
      }
    }
    setIsAlertOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const requestSort = (key: keyof Game) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedGames = [...filteredGames].sort((a, b) => {
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';
    
    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

 return (
  <div className="w-full max-w-[100vw] overflow-x-hidden px-4 relative">
    {/* Header y controles */}
    <div className="mb-6 flex flex-wrap items-center justify-between p-3 gap-2 shadow-sm rounded-lg">
      <h1 className="text-2xl md:text-3xl font-bold font-headline">Panel de Administración</h1>
      <div className="flex gap-2 items-center">
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="rounded-full bg-blue-600 text-white p-2 hover:bg-blue-700 transition"
            title="Buscar juego"
          >
            <span className="text-lg font-bold">?</span>
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título..."
            className={`transition-all duration-300 ease-in-out text-sm p-2 rounded-md bg-white border border-gray-300 shadow-sm ${
              showSearch ? "w-48 opacity-100 ml-2" : "w-0 opacity-0 ml-0 overflow-hidden"
            }`}
          />
        </div>
        <Button 
          variant='outline'
          className="bg-white text-blue-500 hover:bg-blue-100"
          onClick={handleAddNew}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        
        <Button 
          asChild
          variant="outline"
          className="bg-white text-emerald-600 hover:bg-emerald-100"
        >
          <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>

        <Button 
          variant="outline"
          onClick={handleLogout}
          className="text-fuchsia-600 hover:bg-fuchsia-100"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Tabla de juegos */}
    <div className="overflow-x-auto">
      <div className="min-w-[600px] md:min-w-0">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-fuchsia-800">
            <tr>
              <th 
                className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-fuchsia-700 transition"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center">
                  Título
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                  {sortConfig.key === 'title' && (
                    <span className="ml-1 text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-fuchsia-700 transition"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center">
                  Categoría
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                  {sortConfig.key === 'category' && (
                    <span className="ml-1 text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-fuchsia-700 transition"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center">
                  Precio
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                  {sortConfig.key === 'price' && (
                    <span className="ml-1 text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-3 py-4 whitespace-nowrap"><Skeleton className="h-5 w-32" /></td>
                  <td className="px-3 py-4 whitespace-nowrap"><Skeleton className="h-5 w-24" /></td>
                  <td className="px-3 py-4 whitespace-nowrap"><Skeleton className="h-5 w-16" /></td>
                  <td className="px-3 py-4 whitespace-nowrap text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                </tr>
              ))
            ) : (
              sortedGames.map((game) => (
                <tr 
                  key={game.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEdit(game)}
                >
                  <td className="px-3 py-4 whitespace-nowrap font-medium text-gray-900">
                    {game.title}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                    {game.category}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                    {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end"
                        side="left"
                        className="bg-gray-100 shadow-xl border-gray-300 min-w-[150px]"
                        sideOffset={5}
                        collisionPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(game);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(game);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    <Separator className="my-6 md:my-12" />

    <GameForm
      isOpen={isFormOpen}
      setIsOpen={setIsFormOpen}
      game={selectedGame}
      className="fixed inset-0 overflow-auto sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
    />

    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2">
            Esta acción no se puede deshacer. Esto eliminará permanentemente el juego <strong>"{gameToDelete?.title}"</strong> de tu catálogo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-3">
          <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const { data: adminData } = await supabase
            .from("admin_users")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (adminData) {
            setIsAuthenticated(true);
          } else {
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Si hay error de refresh token, limpiar sesión
        if (error instanceof Error && error.message.includes('Invalid Refresh Token')) {
          await supabase.auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[100vw] overflow-x-hidden px-4 py-8">
      {isAuthenticated ? (
        <AdminPanel />
      ) : (
        <SupabaseAuth onSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}
