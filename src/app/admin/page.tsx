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
import { PlusCircle, MoreHorizontal, Edit, Trash2, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceEditor } from "@/components/price-editor";
import { useRouter } from 'next/navigation';
import { DollarSign } from "lucide-react";
import { Lock } from "lucide-react";
import ContactFormEditor from "@/components/ui/contactoActualizar";










  function ChangePasswordForm() {
      const [currentPassword, setCurrentPassword] = useState('');
      const [newPassword, setNewPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [error, setError] = useState('');
      const [successMessage, setSuccessMessage] = useState('');
  
      const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setError('');
          setSuccessMessage('');
  
          const storedPassword = localStorage.getItem('adminPassword') || 'admin';
  
          if (currentPassword !== storedPassword) {
              setError('La contraseña actual es incorrecta.');
              return;
          }
  
          if (newPassword.length < 4) {
              setError('La nueva contraseña debe tener al menos 4 caracteres.');
              return;
          }
  
          if (newPassword !== confirmPassword) {
              setError('Las nuevas contraseñas no coinciden.');
              return;
          }
  
          localStorage.setItem('adminPassword', newPassword);
          setSuccessMessage('Tu contraseña ha sido actualizada.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
      };
  
      return (
  
  
  
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
value= 'contacto'
className='data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition'>
Info de Admin
</TabsTrigger>

      </TabsList>
      <TabsContent value="password">
          <Card>
              <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>Actualiza la contraseña de administrador.</CardDescription>
              </CardHeader>
              <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                      <Button type="submit">
                          <KeyRound className="mr-2 h-4 w-4" />
                          Cambiar Contraseña
                      </Button>
                  </form>
              </CardContent>
          </Card>
    </TabsContent>
      <TabsContent value="rangos">
      <PriceEditor />
    </TabsContent>
    <TabsContent value= 'contacto'>
      <ContactFormEditor />
    </TabsContent>
  
  </Tabs>
      );
  }
  
  function AdminPanel() {
    const { games, deleteGame, isLoading } = useContext(GameContext);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | undefined>(undefined);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
  
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
  
    const filteredGames = games.filter((game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [showSearch, setShowSearch] = useState(false);
  
    return (
      <>
        <div className="mb-6 flex flex-wrap items-center justify-between p-3 gap-2 shadow-sm rounded-lg">
          <h1 className="text-3xl font-bold font-headline">Panel de Administración</h1>
          <div className="flex gap-2 items-center">
<div className="relative flex items-center gap-2">
  {/* Botón redondo con signo de interrogación */}
  <button
    type="button"
    onClick={() => setShowSearch(!showSearch)}
    className="rounded-full bg-blue-600 text-white p-2 hover:bg-blue-700 transition"
    title="Buscar juego"
  >
    <span className="text-lg font-bold">?</span>
  </button>

  {/* Campo de búsqueda expandible */}
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
              className="bg-white text-blue-500 hover:bg-blue-100"
              onClick={handleAddNew}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo
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
  
        <ChangePasswordForm />
  
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
  
  
  function PasswordPrompt({ onCorrectPassword }: { onCorrectPassword: () => void }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [storedPassword, setStoredPassword] = useState('admin');
  
    useEffect(() => {
      // This code runs only on the client
      const savedPassword = localStorage.getItem('adminPassword');
      if (savedPassword) {
        setStoredPassword(savedPassword);
      }
    }, []);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === storedPassword) {
        onCorrectPassword();
      } else {
        setError('Contraseña incorrecta');
      }
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">

        <Card className="w-full max-w-sm shadow-md border border-slate-200 rounded-xl bg-white">

          <CardHeader>

<CardTitle className="text-2xl font-bold flex items-center gap-2 text-blue-800">
  <Lock className="h-5 w-5 text-blue-600" />
  Acceso Restringido
</CardTitle>

            <CardDescription className="text-sm text-gray-500 mt-1">
              Por favor, introduce la contraseña para acceder al panel de administración.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
  className="border border-slate-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"

                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    // Effect to run only on the client
    useEffect(() => {
        // Check for a session flag
        const sessionIsAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
        if (sessionIsAuthenticated) {
            setIsAuthenticated(true);
        }
    }, []);
  
    const handleAuthentication = () => {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
    };
  
    return (
      <div className="container mx-auto px-5 py-8">
        {isAuthenticated ? (
          <AdminPanel />
        ) : (
          <PasswordPrompt onCorrectPassword={handleAuthentication} />
        )}
      </div>
    );
  }


