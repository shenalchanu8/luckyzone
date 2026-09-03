import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const iconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
};

export default function SocialLinks({ links = [] }) {
  return (
    <div className="mt-4 flex flex-wrap justify-start gap-3">
      {links.map((link) => {
        const Icon = iconMap[link.icon];

        return (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 sm:h-12 sm:w-12 ${link.className}`}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
