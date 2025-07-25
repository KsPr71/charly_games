'use client';

import { useState, useContext, useEffect } from 'react';
import type { Game } from '@/lib/types';
import { GameContext } from '@/context/game-provider';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GameForm } from '@/components/game-form';
import { PlusCircle, MoreHorizontal, Edit, Trash2, KeyRound, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceEditor } from "@/components/price-editor";
import { useRouter } from 'next/navigation';
import { DollarSign, Lock } from "lucide-react";
import ContactFormEditor from "@/components/ui/contactoActualizar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Componente para cambiar contraseña con Supabase
function SupabasePasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Verificar contraseña actual
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword,
      });

      if (authError) throw new Error('Contraseña actual incorrecta');

      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>Actualiza tu contraseña de administrador.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <Button type="submit" disabled={loading}>
            <KeyRound className="mr-2 h-4 w-4" />
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Componente de formulario de autenticación con Supabase
function SupabaseAuth({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Verificar si el usuario es admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', data.user?.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('No tienes permisos de administrador');
      }

      onSuccess();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
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
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
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
    setGameToDelete(game);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (gameToDelete) {
      await deleteGame(gameToDelete.id);
      setGameToDelete(null);
    }
    setIsAlertOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between p-3 gap-2 shadow-sm rounded-lg">
        <h1 className="text-3xl font-bold font-headline">Panel de Administración</h1>
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
          variant= 'outline'
            className="bg-white text-blue-500 hover:bg-blue-100"
            onClick={handleAddNew}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="text-fuchsia-600 hover:hover:bg-fuchsia-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader className='bg-fuchsia-800'>
            <TableRow>
              <TableHead className='font-bold text-white'>Título</TableHead>
              <TableHead className='font-bold text-white'>Categoría</TableHead>
              <TableHead className='font-bold text-white'>Precio</TableHead>
              <TableHead className="text-right font-bold text-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              filteredGames.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>{game.category}</TableCell>
                  <TableCell>{game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className='bg-gray-100 shadow-xl border-gray-300'>
                        <DropdownMenuItem onClick={() => handleEdit(game)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(game)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Separator className="my-12" />

      <Tabs defaultValue="juegos" className="w-full">
        <TabsList className="bg-blue-100 mb-4">
          <TabsTrigger
            value="password"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition"
          >
            <KeyRound className="inline mr-2 h-4 w-4" />
            Cambiar Contraseña
          </TabsTrigger>
          <TabsTrigger
            value="rangos"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition"
          >
            <DollarSign className="inline-block mr-2 h-4 w-4 text-white-700" />
            Rangos de Precio
          </TabsTrigger>
          <TabsTrigger
            value='contacto'
            className='data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition'
          >
            Info de Admin
          </TabsTrigger>
        </TabsList>
        <TabsContent value="password">
          <SupabasePasswordChange />
        </TabsContent>
        <TabsContent value="rangos">
          <PriceEditor />
        </TabsContent>
        <TabsContent value='contacto'>
          <ContactFormEditor />
        </TabsContent>
      </Tabs>

      <GameForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        game={selectedGame}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el juego "{gameToDelete?.title}" de tu catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Verificar si el usuario es admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (adminData) {
            setIsAuthenticated(true);
          } else {
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
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
    <div className="container mx-auto px-5 py-8">
      {isAuthenticated ? (
        <AdminPanel />
      ) : (
        <SupabaseAuth onSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}