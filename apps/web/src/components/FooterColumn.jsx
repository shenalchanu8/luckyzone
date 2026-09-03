export default function FooterColumn({ title, links = [] }) {
  return (
    <div className="text-center md:text-left">
      <h3 className="text-xl font-semibold text-[#111827]">{title}</h3>
      <ul className="mt-5 space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[15px] text-[#6B7280] transition-colors duration-300 hover:text-[#14532D]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
