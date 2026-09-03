import FooterBrand from "./FooterBrand";
import PaymentMethods from "./PaymentMethods";
import luckyZoneLogo from "../assets/luckyzone-logo.png";
import visaIcon from "../assets/payments/visa.png";
import mastercardIcon from "../assets/payments/mastercard.png";
import kokoIcon from "../assets/payments/koko.png";
import bankTransferIcon from "../assets/payments/bank-transfer.png";
import cashOnDeliveryIcon from "../assets/payments/cash-on-delivery.png";

const socialLinks = [
  { label: "Facebook", href: "#", icon: "facebook", className: "bg-[#1877F2]" },
  { label: "Instagram", href: "#", icon: "instagram", className: "bg-[#C13584]" },
  { label: "WhatsApp", href: "#", icon: "whatsapp", className: "bg-[#25D366]" },
  { label: "TikTok", href: "#", icon: "tiktok", className: "bg-[#111111]" },
];

const paymentMethods = [
  { label: "Visa", imageSrc: visaIcon, href: "#" },
  { label: "Mastercard", imageSrc: mastercardIcon, href: "#" },
  { label: "Koko", imageSrc: kokoIcon, href: "#" },
  { label: "Bank Transfer", imageSrc: bankTransferIcon, href: "#" },
  { label: "Cash on Delivery", imageSrc: cashOnDeliveryIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer className="site-soft-band w-full overflow-x-hidden border-t border-[#DCEFE5] text-[#111827]">
      <div className="mx-auto w-full max-w-[1700px] px-4 py-8 min-[420px]:px-5 sm:px-6 sm:py-9 md:px-8 md:py-10 lg:px-10 lg:py-11 xl:px-12 xl:py-12 2xl:px-16 2xl:py-14">
        <div className="grid gap-7 sm:gap-8">
          <FooterBrand
            logoSrc={luckyZoneLogo}
            socialLinks={socialLinks}
            branchTitle="LuckyZone - Main Branch"
            branchAddressLines={[
              "No. 309, Galle Road,",
              "Ambalangoda, Sri Lanka.",
            ]}
          />
        </div>
      </div>

      <div className="border-t border-[#DCEFE5] bg-white/70">
        <div className="mx-auto flex w-full max-w-[1700px] flex-col items-center gap-5 px-4 py-5 text-center min-[420px]:px-5 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-6 lg:text-left xl:px-12 2xl:px-16">
          <p className="mx-auto max-w-[360px] text-[13px] leading-6 text-[#667085] sm:max-w-none sm:text-[14px] lg:mx-0 lg:text-[15px]">
            <span className="font-semibold text-[#111827]">LuckyZone</span> © 2026. All
            Rights Reserved. Created by{" "}
            <a
              href="/"
              className="font-semibold text-[#0F5B44] transition-colors duration-300 hover:text-[#F97316]"
            >
              IONIXPOS.LK
            </a>
            .
          </p>

          <PaymentMethods methods={paymentMethods} />
        </div>
      </div>
    </footer>
  );
}
