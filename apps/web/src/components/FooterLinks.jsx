import { HiChevronRight } from "react-icons/hi";

export default function FooterLinks({ title, links = [] }) {
  return (
    <nav aria-label={title} className="min-w-0 text-left">
      <h2 className="text-[18px] font-semibold text-[#111827] sm:text-[20px]">{title}</h2>
      <span className="mt-2.5 inline-block h-[3px] w-7 rounded-full bg-[#F97316] sm:mt-3" />

      <ul className="mt-6 grid max-w-[360px] gap-3 min-[520px]:grid-cols-2 md:max-w-none md:grid-cols-1 sm:mt-7 lg:gap-4 xl:gap-5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group inline-flex min-h-9 items-center gap-2.5 text-[14px] leading-6 text-[#667085] transition-colors duration-300 hover:text-[#0F5B44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 sm:text-[15px] xl:text-[16px]"
            >
              <HiChevronRight className="h-4 w-4 shrink-0 text-[#0F5B44] transition-transform duration-300 group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
              <span className="min-w-0 break-words">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
