export default function ServiceBadge({ icon: Icon, label, description }) {
  return (
    <div className="group flex min-h-[84px] min-w-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-left shadow-[0_16px_38px_rgba(15,91,68,0.08)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_46px_rgba(15,91,68,0.12)] min-[420px]:gap-4 sm:min-h-[92px] sm:px-5">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ff6b00] transition duration-300 group-hover:bg-[#ff6b00] group-hover:text-white sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <strong className="block text-[14px] font-bold leading-5 text-slate-950 sm:text-[15px]">{label}</strong>
        <span className="mt-1 block text-[12px] leading-5 text-slate-600 sm:text-[13px]">{description}</span>
      </span>
    </div>
  );
}
