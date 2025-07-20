'use client'
import { MapPin, Phone, Instagram, Facebook} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { useContact } from '../../context/ContactContext';
import { FaFacebook } from 'react-icons/fa';

export default function ContactPage() {

  const { contactInfo, loading } = useContact();
  
  if (loading) {
    return <div>Cargando información de contacto...</div>;
  }

  if (!contactInfo) {
    return <div>No se pudo cargar la información de contacto</div>;
  }

  const address = contactInfo.direccion || "Dirección no disponible";

  const mobilePhone = contactInfo.telefono;
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d919.8662423789417!2d-77.9381644056768!3d21.393271875462677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDIzJzM1LjgiTiA3N8KwNTYnMTcuNCJX!5e0!3m2!1ses!2ses!4v1721061925000!5m2!1ses!2ses";
  const facebook = contactInfo.facebook;
  const instagram = contactInfo.insta;

  return (
    <div className='bg-white p-10'>
    <div className="flex justify-center items-center py-8"> 
      <Image
      src='/logo1.png'
      alt= 'CharlyGames'
      width= {200}
      height= {200}/>
    </div>

    <div className="container mx-auto max-w-4xl px-4 py-12 p-10 bg-gray-100 border-1 rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold font-headline">Contáctanos</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Estamos aquí para ayudarte. Ponte en contacto con nosotros.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-8">
          <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-fuchsia-500'>Nuestra Ubicación</CardTitle>
              <CardDescription>Visítanos en nuestra tienda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <p className="text-muted-foreground">{address}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-fuchsia-500'>Teléfono</CardTitle>
              <CardDescription>Llámanos para cualquier consulta.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 text-primary" />
                <a href={`tel:${mobilePhone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary">
                  {mobilePhone}
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-fuchsia-500'>Facebook</CardTitle>
              <CardDescription>Localizanos en Facebook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Facebook className="h-6 w-6 flex-shrink-0 text-primary" />
                <a href={`${facebook.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary">
                  {facebook}
                </a>
              </div>
            </CardContent>
          </Card>

                    <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-fuchsia-500'>Instagram</CardTitle>
              <CardDescription>Siguenos en Instagram</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Instagram className="h-6 w-6 flex-shrink-0 text-primary" />
                <a href={`${instagram.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary">
                  {instagram}
                </a>
              </div>
            </CardContent>
          </Card>

        </div>

        <div>
          <Card className="overflow-hidden bg-blue-50">
             <CardHeader>
                <CardTitle className='text-fuchsia-500 p-5'>Encuéntranos en el Mapa</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                    <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de CHARLY GAMES"
                    ></iframe>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
