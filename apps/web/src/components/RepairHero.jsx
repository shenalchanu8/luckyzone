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
      <div className="mx-auto w-full max-w-[1920px] overflow-hidden rounded-[20px] border border-[#d7eadf] bg-white shadow-[0_18px_50px_rgba(15,91,68,0.10)] sm:rounded-[24px] lg:rounded-[28px] lg:shadow-[0_22px_65px_rgba(15,91,68,0.12)]">
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

          <div className="site-soft-band flex items-center px-5 py-8 min-[380px]:px-6 sm:px-8 sm:py-10 md:px-10 md:py-12 min-[980px]:px-10 min-[980px]:py-12 xl:px-14 2xl:px-20">
            <div className="mx-auto w-full max-w-[670px]">
              <p className="select-none text-xs font-bold uppercase tracking-[0.3em] text-forest/70 sm:text-sm sm:tracking-[0.35em]">
                Precision. Trust. Care.
              </p>

              <h2 className="select-none mt-4 text-[clamp(3rem,11vw,5.8rem)] font-light leading-none tracking-[-0.04em] text-slate-950 sm:mt-5 min-[980px]:text-[clamp(4.25rem,5.9vw,6.4rem)]">
                <span className="block">Phone Repair</span>
                <span className="block bg-[linear-gradient(110deg,#0fa968_8%,#45c264_42%,#ff7a18_78%,#ff9f1c_100%)] bg-clip-text text-transparent">Center</span>
              </h2>

              <p className="mt-5 max-w-[650px] text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 xl:text-xl">
                Screen repairs, software fixes, battery replacements, and expert support
                with the quality your device deserves.
              </p>

              <div className="mt-8 grid gap-3 min-[560px]:grid-cols-2 sm:gap-4 lg:mt-9">
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
