export default function PaymentMethods({ methods = [] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-end">
      {methods.map((method) => (
        <a
          key={method.label}
          href={method.href ?? "#"}
          aria-label={method.label}
          className="inline-flex h-11 min-w-[64px] items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white px-3 shadow-[0_4px_14px_rgba(17,24,39,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(17,24,39,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 sm:h-[54px] sm:min-w-[80px] sm:px-4"
        >
          <img
            src={method.imageSrc}
            alt={method.label}
            className="h-6 w-auto max-w-[82px] object-contain sm:h-8 sm:max-w-[110px]"
          />
        </a>
      ))}
    </div>
  );
}
