import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/94765457260"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with LuckyZone on WhatsApp"
      className="absolute bottom-5 right-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_16px_34px_rgba(34,197,94,0.34)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(34,197,94,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 sm:h-16 sm:w-16"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
