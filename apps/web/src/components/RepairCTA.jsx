import { FaShieldHalved } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi";

export default function RepairCTA() {
  return (
    <div className="mt-7 flex flex-col gap-4 min-[560px]:flex-row min-[560px]:items-center lg:mt-9">
      <a
        href="https://wa.me/94765457260"
        target="_blank"
        rel="noreferrer"
        aria-label="Repair now via WhatsApp"
        className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-[14px] bg-[#ff6500] px-6 text-[16px] font-bold text-white shadow-[0_12px_28px_rgba(255,101,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e95c00] hover:shadow-[0_16px_34px_rgba(255,101,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00] focus-visible:ring-offset-2 min-[560px]:h-16 min-[560px]:w-[220px] sm:w-[238px] sm:gap-4 sm:px-8 sm:text-[17px]"
      >
        <span>Repair Now</span>
        <HiArrowRight className="h-6 w-6" />
      </a>

      <div className="hidden h-16 w-px bg-[#d9dde5] min-[560px]:block" aria-hidden="true" />

      <div className="flex items-center gap-3 min-[420px]:gap-4">
        <FaShieldHalved className="h-6 w-6 shrink-0 text-[#526075] sm:h-7 sm:w-7" aria-hidden="true" />
        <p className="text-[13px] font-medium leading-6 text-[#526075] sm:text-[14px]">
          Fast turnaround with
          <br />
          careful diagnostics.
        </p>
      </div>
    </div>
  );
}
