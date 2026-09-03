import BranchInfo from "./BranchInfo";
import SocialLinks from "./SocialLinks";

export default function FooterBrand({
  logoSrc,
  socialLinks,
  branchTitle,
  branchAddressLines,
}) {
  return (
    <div className="grid min-w-0 gap-7 text-left lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.58fr)] lg:items-start lg:gap-12 xl:gap-16">
      <div className="min-w-0">
        <a href="/" className="inline-flex max-w-full items-center justify-start">
          <img
            src={logoSrc}
            alt="LuckyZone"
            className="h-auto w-[min(76vw,210px)] object-contain sm:w-[230px] xl:w-[250px] 2xl:w-[270px]"
          />
        </a>

        <p className="mt-4 max-w-[620px] text-[14px] leading-7 text-[#667085] min-[420px]:text-[15px] sm:mt-5 sm:leading-8 lg:max-w-[680px] lg:text-[15px] xl:text-[16px] xl:leading-8">
          LuckyZone is your trusted destination for premium{" "}
          <span className="font-semibold text-[#111827]">Apple Products</span>,{" "}
          <span className="font-semibold text-[#111827]">Samsung Devices</span>{" "}
          and other smart devices in{" "}
          <span className="font-semibold text-[#111827] underline decoration-[#F97316] decoration-[2px] underline-offset-4">
            Sri Lanka
          </span>
          . We bring the technology you love closer to you.
        </p>
      </div>

      <div className="min-w-0 lg:justify-self-end lg:text-left">
        <div>
          <h2 className="text-[18px] font-semibold text-[#111827] sm:text-[20px]">Subscribe us</h2>
          <SocialLinks links={socialLinks} />
        </div>

        <div className="mt-6 max-w-[520px] border-t border-[#E5E7EB] pt-5 sm:mt-7 sm:pt-6">
          <BranchInfo title={branchTitle} addressLines={branchAddressLines} />
        </div>
      </div>
    </div>
  );
}
