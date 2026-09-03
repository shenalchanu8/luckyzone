export default function FooterGallery({ images = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {images.map((image) => (
        <div
          key={image.alt}
          className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)]"
        >
          <div className="aspect-[240/235] overflow-hidden">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
