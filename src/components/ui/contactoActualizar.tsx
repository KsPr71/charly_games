'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function ContactFormEditor() {
  const supabase = createClientComponentClient();
  
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    whatsapp: '',
    email: '',
    facebook: '',
    insta: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
    const [mensaje, setMensaje] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const { data, error } = await supabase
          .from('contacto')
          .select('*')
          .single();

        if (error) throw error;
        if (data) setFormData(data);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('contacto')
        .update(formData)
        .eq('id', 1); // Asume que solo hay un registro con id=1

      if (!error) {
         setMensaje('Cambios guardados correctamente ✅');
      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('Error al guardar 😞');
      }
      
 
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Información de Contacto</h2>

            {mensaje && (
        <p className="mt-2 text-sm text-green-600 transition-opacity duration-300">
          {mensaje}
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre?? ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={formData.telefono?? ""}
            onChange={handleChange}
            required
          />
        </div>

       

        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            value={formData.facebook?? ""}
            onChange={handleChange}
            placeholder="URL completo"
          />
        </div>

        <div>
          <Label htmlFor="insta">Instagram</Label>
          <Input
            id="insta"
            name="insta"
            value={formData.insta?? ""}
            onChange={handleChange}
            placeholder="@usuario o URL"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>


        </div>
      </form>
    </div>
  );
}