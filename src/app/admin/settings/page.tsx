'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyRound, DollarSign, Mail, Users, ArrowLeft } from 'lucide-react';
import ProffesionalDataTable from '@/components/Suscriptores';
import SupabasePasswordChange from '@/components/SupabasePasswordChange';
import ContactFormEditor from "@/components/ui/contactoActualizar";
import { PriceEditor } from "@/components/price-editor";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón de retroceso */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            Volver al panel principal
          </Link>
        </Button>
      </div>

      {/* Título de la página */}
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Configuraciones Avanzadas</h2>

      {/* Componente de pestañas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="bg-transparent mb-6 p-0 gap-2 flex-wrap">
            <TabsTrigger
              value="password"
              className="
                relative w-10 h-10 p-0 rounded-lg
                bg-white text-gray-700 shadow-sm border border-gray-200
                hover:w-auto hover:px-3 hover:gap-2 transition-all duration-200
                data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white
                data-[state=active]:border-fuchsia-600
                group flex items-center justify-center overflow-hidden
              "
            >
              <KeyRound className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200">
                Contraseña
              </span>
            </TabsTrigger>
            
            <TabsTrigger
              value="rangos"
              className="
                relative w-10 h-10 p-0 rounded-lg
                bg-white text-gray-700 shadow-sm border border-gray-200
                hover:w-auto hover:px-3 hover:gap-2 transition-all duration-200
                data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white
                data-[state=active]:border-fuchsia-600
                group flex items-center justify-center overflow-hidden
              "
            >
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200">
                Precios
              </span>
            </TabsTrigger>
            
            <TabsTrigger
              value='contacto'
              className="
                relative w-10 h-10 p-0 rounded-lg
                bg-white text-gray-700 shadow-sm border border-gray-200
                hover:w-auto hover:px-3 hover:gap-2 transition-all duration-200
                data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white
                data-[state=active]:border-fuchsia-600
                group flex items-center justify-center overflow-hidden
              "
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200">
                Contacto
              </span>
            </TabsTrigger>
            
            <TabsTrigger
              value='suscriptores'
              className="
                relative w-10 h-10 p-0 rounded-lg
                bg-white text-gray-700 shadow-sm border border-gray-200
                hover:w-auto hover:px-3 hover:gap-2 transition-all duration-200
                data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white
                data-[state=active]:border-fuchsia-600
                group flex items-center justify-center overflow-hidden
              "
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200">
                Suscriptores
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="pt-4">
            <TabsContent value="password">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
                <SupabasePasswordChange />
              </div>
            </TabsContent>
            
            <TabsContent value="rangos">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuración de Precios</h3>
                <PriceEditor />
              </div>
            </TabsContent>
            
            <TabsContent value='contacto'>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información de Contacto</h3>
                <ContactFormEditor />
              </div>
            </TabsContent>
            
            <TabsContent value='suscriptores'>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestión de Suscriptores</h3>
                <ProffesionalDataTable/>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;