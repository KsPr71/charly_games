"use client";

import Head from 'next/head';
import SubscribeForm from '../../components/SubscribeForm';
import { useEffect } from 'react';
import {supabase} from '../../lib/supabase'; // Asegúrate que sea export default

export default function SubscribePage() {
  useEffect(() => {
    supabase.from('users').select('*').limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error Supabase:", error.message);
          return;
        }
        console.log("Datos recibidos:", data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Suscríbete</title>
        <meta name="description" content="Página de suscripción" />
      </Head>
      
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Suscríbete a nuestras actualizaciones</h1>
        <div className="max-w-md mx-auto">
          <SubscribeForm />
        </div>
      </main>
    </div>
  );
}