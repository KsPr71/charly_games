'use client';

import { useState, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SupabasePasswordChange = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState<{
    error: string | null;
    success: string | null;
    loading: boolean;
  }>({
    error: null,
    success: null,
    loading: false
  });

  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ error: null, success: null, loading: true });

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({
        error: 'Las contraseñas no coinciden',
        success: null,
        loading: false
      });
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (!user?.email) throw new Error('No se pudo obtener el usuario actual');

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      });

      if (signInError) throw new Error('Contraseña actual incorrecta');

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      setStatus({
        error: null,
        success: 'Contraseña actualizada correctamente',
        loading: false
      });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: unknown) {
      setStatus({
        error: err instanceof Error ? err.message : 'Error al actualizar la contraseña',
        success: null,
        loading: false
      });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Cambiar Contraseña
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Actualiza tu contraseña de administrador
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">
                Contraseña Actual
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                Nueva Contraseña
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="flex-1">
              {status.error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{status.error}</span>
                </div>
              )}
              {status.success && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">{status.success}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={status.loading}
              className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white shadow-md transition-all"
            >
              {status.loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Actualizando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  <span>Cambiar Contraseña</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupabasePasswordChange;