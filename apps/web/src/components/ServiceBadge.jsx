export default function ServiceBadge({ icon: Icon, label, description }) {
  return (
    <div className="group flex min-h-[78px] min-w-0 items-center gap-3 rounded-[18px] border border-[#e2e5ea] bg-white px-3.5 py-3.5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#ff6b00]/40 hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)] min-[420px]:gap-4 min-[420px]:px-4 min-[420px]:py-4 sm:min-h-[88px] sm:rounded-[22px] sm:px-5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff2e8] text-[#ff6b00] transition duration-300 group-hover:bg-[#ff6b00] group-hover:text-white min-[420px]:h-11 min-[420px]:w-11 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      </span>
      <span className="min-w-0">
        <strong className="block text-[14px] font-bold leading-5 text-[#101728] sm:text-[15px]">{label}</strong>
        <span className="mt-0.5 block text-[12px] leading-5 text-[#667085] sm:mt-1 sm:text-[13px]">{description}</span>
      </span>
    </div>
  );
}
