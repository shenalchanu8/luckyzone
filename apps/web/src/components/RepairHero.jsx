import { FaBatteryFull, FaGear, FaMobileScreenButton, FaStethoscope } from "react-icons/fa6";
import RepairCTA from "./RepairCTA";
import ServiceBadge from "./ServiceBadge";

const serviceBadges = [
  { label: "Screen Repair", description: "Cracked screen? We fix it.", icon: FaMobileScreenButton },
  { label: "Battery Service", description: "Longer life for your device.", icon: FaBatteryFull },
  { label: "Software Fixes", description: "Bugs, lag or crashes? Fixed.", icon: FaGear },
  { label: "Diagnostics", description: "Full device checkup.", icon: FaStethoscope },
];

export default function RepairHero() {
  return (
    <section className="site-soft-band w-full px-3 py-8 min-[380px]:px-4 sm:px-6 sm:py-10 md:py-12 lg:px-8 lg:py-14 2xl:py-16">
      <div className="site-soft-card mx-auto w-full max-w-[1920px] overflow-hidden rounded-[20px] border border-[#d7eadf] shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:rounded-[24px] lg:rounded-[28px] lg:shadow-[0_22px_65px_rgba(15,23,42,0.14)]">
        <div className="grid min-[980px]:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <div className="relative min-h-[260px] overflow-hidden bg-[#0b1713] min-[420px]:min-h-[320px] sm:min-h-[420px] md:min-h-[500px] min-[980px]:min-h-[620px] xl:min-h-[700px] 2xl:min-h-[760px]">
            <img
              src="/images/luckyzone-repair-workshop-left.png"
              alt="LuckyZone technician repairing a phone at the service-center workbench"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[58%_center] min-[520px]:object-[54%_center] min-[980px]:object-[56%_center]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/[0.03]" />
          </div>

          <div className="flex items-center bg-white/75 px-5 py-8 min-[380px]:px-6 sm:px-8 sm:py-10 md:px-10 md:py-12 min-[980px]:px-10 min-[980px]:py-12 xl:px-14 2xl:px-20">
            <div className="mx-auto w-full max-w-[670px]">
              <p className="select-none bg-gradient-to-r from-forest via-citrus to-ember bg-clip-text text-[11px] font-bold uppercase tracking-[0.35em] text-transparent min-[420px]:text-[12px] sm:text-[13px]">
                Precision. Trust. Care.
              </p>

              <h2 className="select-none mt-4 text-[clamp(2.45rem,11vw,4.5rem)] font-light leading-[1.03] tracking-[-0.05em] text-slate-950 sm:mt-5 min-[980px]:text-[clamp(3.35rem,5.1vw,4.85rem)]">
                <span className="block">Phone Repair</span>
                <span className="block bg-gradient-to-r from-ember via-citrus to-forest bg-clip-text text-transparent">Center</span>
              </h2>

              <p className="mt-5 max-w-[650px] text-[15px] leading-7 text-[#526075] min-[420px]:text-[16px] sm:mt-6 sm:text-[17px] sm:leading-8 xl:text-[18px]">
                Screen repairs, software fixes, battery replacements, and expert support
                with the quality your device deserves.
              </p>

              <div className="mt-7 grid gap-3 min-[560px]:grid-cols-2 sm:gap-4 lg:mt-8">
                {serviceBadges.map((badge) => (
                  <ServiceBadge key={badge.label} icon={badge.icon} label={badge.label} description={badge.description} />
                ))}
              </div>

              <RepairCTA />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
