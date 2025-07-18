import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloatingButton = () => {
  const phoneNumber = "52708602";
  const message = "Hola, quiero información sobre los juegos del catálogo";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-10 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition animate-bounce"
    >
      <FaWhatsapp className="text-2xl" />
    </a>
  );
};

export default WhatsAppFloatingButton;
