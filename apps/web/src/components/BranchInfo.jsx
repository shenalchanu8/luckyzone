import { HiOutlineLocationMarker } from "react-icons/hi";

export default function BranchInfo({ title, addressLines = [] }) {
  return (
    <div className="flex items-start gap-3 text-left">
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E7F7F1] text-[#0F5B44] sm:h-12 sm:w-12">
        <HiOutlineLocationMarker className="h-6 w-6" />
      </div>

      <div className="min-w-0">
        <h3 className="text-[17px] font-semibold leading-6 text-[#111827] sm:text-[19px]">{title}</h3>
        {addressLines.map((line) => (
          <p key={line} className="mt-1 text-[14px] leading-6 text-[#667085] sm:text-[15px] sm:leading-7">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
