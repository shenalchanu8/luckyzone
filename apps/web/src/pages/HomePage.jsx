import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FaBatteryFull, FaClock, FaHeadphones, FaMobileScreenButton, FaShieldHalved } from "react-icons/fa6";
import RepairHero from "../components/RepairHero";

const deferredImageProps = {
  loading: "lazy",
  decoding: "async"
};

const categories = [
  {
    name: "iPhone",
    slug: "iphone",
    eyebrow: "APPLE",
    image: "/assets/hero-iphone-new.png",
    imageClass: "max-h-[190px] min-[420px]:max-h-[210px] sm:max-h-[230px] md:max-h-[220px] lg:max-h-[260px] xl:max-h-[285px]",
    imageWrapClass: "pb-1 sm:pb-2 xl:pb-3"
  },
  {
    name: "iPad",
    slug: "ipad",
    eyebrow: "APPLE",
    image: "/assets/category-ipad.png",
    imageClass: "max-h-[180px] min-[420px]:max-h-[200px] sm:max-h-[220px] md:max-h-[210px] lg:max-h-[250px] xl:max-h-[275px]",
    imageWrapClass: ""
  },
  {
    name: "MacBooks",
    slug: "mac",
    eyebrow: "APPLE",
    image: "/assets/category-macbook.png",
    imageClass: "max-h-[175px] min-[420px]:max-h-[195px] sm:max-h-[215px] md:max-h-[205px] lg:max-h-[245px] xl:max-h-[270px]",
    imageWrapClass: ""
  },
  {
    name: "Apple Watch",
    slug: "watch",
    eyebrow: "APPLE",
    image: "/assets/category-watch.png",
    imageClass: "max-h-[175px] min-[420px]:max-h-[200px] sm:max-h-[220px] md:max-h-[210px] lg:max-h-[250px] xl:max-h-[275px]",
    imageWrapClass: ""
  },
  {
    name: "AirPods",
    slug: "airpods",
    eyebrow: "APPLE",
    image: "/assets/category-airpods.png",
    imageClass: "max-h-[165px] min-[420px]:max-h-[190px] sm:max-h-[210px] md:max-h-[200px] lg:max-h-[235px] xl:max-h-[260px]",
    imageWrapClass: ""
  },
  {
    name: "Accessories",
    slug: "accessories",
    eyebrow: "ORIGINAL",
    image: "/assets/category-accessories.png",
    imageClass: "max-h-[160px] min-[420px]:max-h-[185px] sm:max-h-[205px] md:max-h-[195px] lg:max-h-[230px] xl:max-h-[255px]",
    imageWrapClass: ""
  }
];

const featuredProducts = [
  { name: "LuckyZone Pro Phone", price: "LKR 299,990", tag: "Latest release" },
  { name: "LuckyBuds Air", price: "LKR 44,990", tag: "Best audio" },
  { name: "LuckyPad Slim", price: "LKR 189,990", tag: "Work and play" },
  { name: "LuckyWatch Active", price: "LKR 94,990", tag: "Fitness ready" }
];

const deviceEssentials = [
  {
    name: "Mobile Phones",
    description: "New and premium smart devices.",
    link: "/categories/mobile-phones",
    icon: FaMobileScreenButton,
    image: "/assets/device-essential-mobile-phones.png",
    imageClass: "max-h-[112px] max-w-[88%]",
    spotlightClass: "max-h-[250px] max-w-[88%]"
  },
  {
    name: "Smart Watch",
    description: "Wearables for everyday tracking.",
    link: "/categories/smart-watch",
    icon: FaClock,
    image: "/assets/device-essential-smart-watch.png",
    imageClass: "max-h-[118px] max-w-[82%]",
    spotlightClass: "max-h-[270px] max-w-[84%]"
  },
  {
    name: "AirPods",
    description: "Wireless audio for daily use.",
    link: "/categories/airpods",
    icon: FaHeadphones,
    image: "/assets/device-essential-airpods.png",
    imageClass: "max-h-[112px] max-w-[82%]",
    spotlightClass: "max-h-[260px] max-w-[82%]"
  },
  {
    name: "Headsets",
    description: "Comfortable sound for calls and music.",
    link: "/categories/headsets",
    icon: FaHeadphones,
    image: "/assets/device-essential-headset.png",
    imageClass: "max-h-[118px] max-w-[78%]",
    spotlightClass: "max-h-[270px] max-w-[78%]"
  },
  {
    name: "Accessories",
    description: "Useful add-ons for your devices.",
    link: "/categories/other-accessories",
    icon: FaShieldHalved,
    image: "/assets/category-accessories.png",
    imageClass: "max-h-[112px] max-w-[76%]",
    spotlightClass: "max-h-[250px] max-w-[74%]"
  },
  {
    name: "Power Banks",
    description: "Portable charging for busy days.",
    link: "/categories/power-banks",
    icon: FaBatteryFull,
    image: "/assets/device-essential-power-bank.png",
    imageClass: "max-h-[118px] max-w-[76%]",
    spotlightClass: "max-h-[270px] max-w-[76%]"
  }
];

const deviceCollectionCards = [
  {
    title: "Apple Devices Collection",
    description: "Discover iPhone, iPad and MacBook innovation.",
    cta: "Explore Apple",
    link: "/categories/iphone",
    image: "/assets/hero-iphone-pro-new.png",
    imageClass: "max-h-[190px] max-w-[82%]",
    theme: "bg-white"
  },
  {
    title: "Samsung Devices",
    description: "Experience the latest Galaxy technology.",
    cta: "Explore Samsung",
    link: "/categories/samsung-phones",
    image: "/assets/samsung-card-phone-new-transparent.png",
    imageClass: "max-h-[185px] max-w-[84%]",
    theme: "bg-[#071226] text-white"
  },
  {
    title: "Smart Watches",
    description: "Apple Watch and Galaxy Watch essentials.",
    cta: "View Collection",
    link: "/categories/smart-watch",
    image: "/assets/device-essential-smart-watch.png",
    imageClass: "max-h-[170px] max-w-[78%]",
    theme: "bg-white"
  }
];

const guideCards = [
  {
    eyebrow: "COMPARE SAMSUNG MODELS",
    title: "Discover the Samsung model that suits your lifestyle.",
    image: "/assets/guide-card-2-transparent.png",
    link: "/categories/samsung-phones",
    accent: "from-forest via-citrus to-ember"
  },
  {
    eyebrow: "COMPARE IPHONE MODELS",
    title: "Find the right iPhone with a more modern design feel.",
    image: "/assets/guide-card-1-transparent.png",
    link: "/categories/iphone",
    accent: "from-ember via-citrus to-forest"
  },
  {
    eyebrow: "SHOP IPHONE SMARTER",
    title: "Compare two premium iPhone looks before you decide.",
    image: "/assets/guide-card-3-transparent.png",
    link: "/categories/iphone",
    accent: "from-forest via-emerald-500 to-citrus"
  }
];

const macShowcaseCards = [
  {
    name: "MacBook Neo",
    image: "/assets/mac-card-neo-home.png",
    link: "/categories/mac"
  },
  {
    name: "MacBook Air",
    image: "/assets/mac-card-air-home.png",
    link: "/categories/mac"
  },
  {
    name: "MacBook Pro",
    image: "/assets/mac-card-pro-home.png",
    link: "/categories/mac"
  },
  {
    name: "iMac",
    image: "/assets/mac-card-imac-home.png",
    link: "/categories/mac"
  },
  {
    name: "Mac mini",
    image: "/assets/mac-card-mini-home.png",
    link: "/categories/mac"
  }
];

const ipadCollectionCards = [
  {
    name: "iPad Pro",
    image: "/assets/ipad-card-pro-red.png",
    link: "/categories/ipad"
  },
  {
    name: "iPad Air",
    image: "/assets/ipad-card-air-dark.png",
    link: "/categories/ipad"
  },
  {
    name: "iPad",
    image: "/assets/ipad-card-classic.png",
    link: "/categories/ipad"
  },
  {
    name: "iPad mini",
    image: "/assets/ipad-card-mini.png",
    link: "/categories/ipad"
  }
];

const samsungCollectionCards = [
  {
    name: "Phone",
    eyebrow: "SAMSUNG",
    image: "/assets/samsung-card-phone-new-transparent.png",
    link: "/categories/samsung-phones",
    imageClass: "max-h-[205px] max-w-[82%] md:max-h-[220px] md:max-w-[78%]"
  },
  {
    name: "Watch",
    eyebrow: "SAMSUNG",
    image: "/assets/samsung-card-watch-new-transparent.png",
    link: "/categories/samsung-watches",
    imageClass: "max-h-[200px] max-w-[70%] md:max-h-[215px] md:max-w-[66%]"
  },
  {
    name: "Air Buds",
    eyebrow: "SAMSUNG",
    image: "/assets/samsung-card-buds-new-transparent.png",
    link: "/categories/samsung-earbuds",
    imageClass: "max-h-[210px] max-w-[72%] md:max-h-[225px] md:max-w-[68%]"
  },
  {
    name: "Tablet",
    eyebrow: "SAMSUNG",
    image: "/assets/samsung-card-tablet-new-transparent.png",
    link: "/categories/samsung-tablets",
    imageClass: "max-h-[205px] max-w-[78%] md:max-h-[225px] md:max-w-[74%]"
  },
  {
    name: "Head Set",
    eyebrow: "SAMSUNG",
    image: "/assets/samsung-card-headset-new-transparent.png",
    link: "/categories/samsung-headsets",
    imageClass: "max-h-[205px] max-w-[76%] md:max-h-[220px] md:max-w-[72%]"
  },
  {
    name: "Accessories",
    eyebrow: "SAMSUNG",
    image: "/assets/samsung-card-accessories-new-transparent.png",
    link: "/categories/samsung-accessories",
    imageClass: "max-h-[190px] max-w-[72%] md:max-h-[205px] md:max-w-[68%]"
  }
];

const heroSlides = [
  {
    src: "/assets/hero-carousel-iphone-a-transparent.png",
    alt: "iPhone hero showcase",
    link: "/categories/iphone",
    imageClass: ""
  },
  {
    src: "/assets/hero-carousel-samsung-ultra-transparent.png",
    alt: "Samsung Ultra hero showcase",
    link: "/categories/samsung-phones",
    imageClass: "scale-[1.16] md:scale-[1.22] lg:scale-[1.28]"
  },
  {
    src: "/assets/hero-carousel-samsung-fold-transparent.png",
    alt: "Samsung foldables hero showcase",
    link: "/categories/samsung-phones",
    imageClass: "scale-[1.14] md:scale-[1.2] lg:scale-[1.26]"
  },
  {
    src: "/assets/hero-carousel-iphone-b-transparent.png",
    alt: "iPhone premium hero showcase",
    link: "/categories/iphone",
    imageClass: ""
  },
  {
    src: "/assets/hero-carousel-watch-transparent.png",
    alt: "Smartwatch hero showcase",
    link: "/categories/watch",
    imageClass: ""
  },
  {
    src: "/assets/hero-carousel-imac-transparent.png",
    alt: "iMac hero showcase",
    link: "/categories/mac",
    imageClass: ""
  }
];

const carouselSlides = [heroSlides[heroSlides.length - 1], ...heroSlides, heroSlides[0]];

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const realActiveIndex = (activeIndex - 1 + heroSlides.length) % heroSlides.length;
  const activeSlide = heroSlides[realActiveIndex];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => current + 1);
      setIsTransitionEnabled(true);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="site-soft-band overflow-hidden text-slate-900" aria-label="Featured product collections">
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(209,250,229,0.46),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,255,251,0.82))]" />
          <div className="relative z-10 px-4 pb-5 pt-7 sm:px-6 sm:pb-7 sm:pt-9 md:pt-10 lg:px-8 lg:pb-8 lg:pt-9 2xl:pt-11">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.34em] text-forest sm:text-[10px] sm:tracking-[0.4em] md:text-[11px]">
                Premium Smart Devices
              </p>
              <h1 className="mt-3 bg-gradient-to-r from-forest via-citrus to-ember bg-clip-text text-[clamp(2.15rem,6vw,4.1rem)] font-light leading-[1.04] tracking-[-0.05em] text-transparent sm:mt-4">
                Explore Premium Lineup
              </h1>
              <p className="mx-auto mt-3 max-w-2xl bg-gradient-to-r from-slate-700 via-forest to-slate-700 bg-clip-text text-[13px] font-normal leading-6 text-transparent sm:mt-4 sm:text-sm sm:leading-7 md:text-base">
                Discover premium phones, watches, and flagship devices in a refined shopping experience.
              </p>
              <div className="mt-5 sm:mt-6">
                <Link
                  to={activeSlide.link}
                  className="inline-flex min-h-11 items-center rounded-full border border-orange-300 bg-white px-6 py-2.5 text-[13px] font-bold text-orange-500 shadow-[0_10px_25px_rgba(249,115,22,0.14)] transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 sm:px-7 sm:py-3 sm:text-sm"
                >
                  See More
                </Link>
              </div>
            </div>

            <div className="relative mx-auto mt-2 h-[290px] w-full max-w-[1500px] overflow-hidden min-[420px]:h-[330px] sm:mt-3 sm:h-[400px] md:h-[470px] lg:mt-4 lg:h-[520px] xl:h-[560px] 2xl:h-[620px]">
              <div
                className={`flex h-full ${isTransitionEnabled ? "transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}`}
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                onTransitionEnd={() => {
                  if (activeIndex === carouselSlides.length - 1) {
                    setIsTransitionEnabled(false);
                    setActiveIndex(1);
                  } else if (activeIndex === 0) {
                    setIsTransitionEnabled(false);
                    setActiveIndex(heroSlides.length);
                  }
                }}
              >
                {carouselSlides.map((slide, index) => (
                  <div
                    key={`${slide.src}-${index}`}
                    className="relative h-full w-full shrink-0 overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 flex items-center justify-center px-1 pb-1 pt-3 transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:pb-2 sm:pt-4 md:px-8 lg:px-10 ${
                        activeIndex === index
                          ? "translate-y-0 opacity-100 blur-none"
                          : "translate-y-5 opacity-0 blur-[2px]"
                      }`}
                    >
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        loading={index === 1 ? "eager" : "lazy"}
                        fetchPriority={index === 1 ? "high" : "auto"}
                        decoding="async"
                        className={`h-full w-full select-none object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${slide.imageClass}`}
                        draggable="false"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="mt-1 flex min-h-7 items-center justify-center gap-2 sm:mt-2 sm:gap-2.5">
              {heroSlides.map((slide, index) => (
                <button
                  key={`${slide.src}-dot`}
                  type="button"
                  aria-label={`Show hero slide ${index + 1}`}
                  onClick={() => {
                    setIsTransitionEnabled(true);
                    setActiveIndex(index + 1);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    realActiveIndex === index
                      ? "w-8 bg-gradient-to-r from-forest via-citrus to-ember"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const upgradeSectionRef = useRef(null);
  const upgradeHeadingRef = useRef(null);
  const upgradeCtaRef = useRef(null);
  const upgradeLeftRef = useRef(null);
  const upgradeRightRef = useRef(null);
  const upgradeLeftInnerRef = useRef(null);
  const upgradeRightInnerRef = useRef(null);
  const macCollectionRef = useRef(null);
  const ipadCollectionRef = useRef(null);
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(0);
  const activeDevice = deviceEssentials[activeDeviceIndex];
  const ActiveDeviceIcon = activeDevice.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveDeviceIndex((currentIndex) => (currentIndex + 1) % deviceEssentials.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = upgradeSectionRef.current;
    const heading = upgradeHeadingRef.current;
    const cta = upgradeCtaRef.current;
    const left = upgradeLeftRef.current;
    const right = upgradeRightRef.current;
    const leftInner = upgradeLeftInnerRef.current;
    const rightInner = upgradeRightInnerRef.current;
    const macCollection = macCollectionRef.current;
    const ipadCollection = ipadCollectionRef.current;
    const scrollContainer = document.querySelector(".site-scroll-area");

    if (!section || !heading || !cta || !left || !right || !leftInner || !rightInner) {
      gsap.set([heading, cta, left, right].filter(Boolean), { autoAlpha: 1 });
      return undefined;
    }

    const handleMouseEnter = () => {
      gsap.to(leftInner, {
        x: 26,
        scale: 1.02,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto"
      });
      gsap.to(rightInner, {
        x: -26,
        scale: 1.02,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([leftInner, rightInner], {
        x: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    const ctx = gsap.context(() => {
      const macCards = macCollection?.querySelectorAll("[data-mac-card]") ?? [];
      const ipadCards = ipadCollection?.querySelectorAll("[data-ipad-card]") ?? [];

      gsap.set([heading, cta], { autoAlpha: 0, y: 18 });
      gsap.set(left, { xPercent: -110, autoAlpha: 0, scale: 0.96 });
      gsap.set(right, { xPercent: 110, autoAlpha: 0, scale: 0.96 });
      gsap.set([leftInner, rightInner], { x: 0, scale: 1, transformOrigin: "center center" });
      gsap.set(macCards, {
        autoAlpha: 0,
        y: 56,
        scale: 0.94,
        rotateY: 5,
        transformOrigin: "center bottom"
      });

      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          ...(scrollContainer ? { scroller: scrollContainer } : {}),
          start: "top 65%",
          end: "bottom top",
          scrub: false,
          toggleActions: "play reverse play reverse"
        }
      });

      introTimeline
        .to(
          heading,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          },
          0
        )
        .to(
          cta,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          },
          0.08
        )
        .to(
          left,
          {
            xPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
          },
          0.2
        )
        .to(
          right,
          {
            xPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
          },
          0.3
        );

      if (macCards.length) {
        gsap.to(macCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: macCollection,
            ...(scrollContainer ? { scroller: scrollContainer } : {}),
            start: "top 78%",
            toggleActions: "play none none reverse"
          }
        });
      }

      if (ipadCards.length) {
        gsap.set(ipadCards, {
          autoAlpha: 0,
          y: 52,
          scale: 0.95,
          rotateY: -4,
          transformOrigin: "center bottom"
        });

        gsap.to(ipadCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: ipadCollection,
            ...(scrollContainer ? { scroller: scrollContainer } : {}),
            start: "top 78%",
            toggleActions: "play none none reverse"
          }
        });
      }

      ScrollTrigger.refresh();
    }, section);

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      ctx.revert();
    };
  }, []);

  return (
    <main className="site-soft-green">
      <a
        href="https://wa.me/94765457260"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_rgba(37,211,102,0.38)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(37,211,102,0.48)]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
          <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.6 2 2.17 6.42 2.17 11.86c0 1.74.45 3.45 1.32 4.96L2 22l5.32-1.39a9.8 9.8 0 0 0 4.7 1.19h.01c5.43 0 9.86-4.43 9.86-9.86 0-2.63-1.02-5.1-2.84-6.99ZM12.03 20.14h-.01a8.12 8.12 0 0 1-4.14-1.13l-.3-.18-3.16.83.84-3.08-.2-.31a8.16 8.16 0 0 1-1.26-4.41c0-4.5 3.67-8.17 8.18-8.17 2.18 0 4.23.84 5.77 2.39a8.1 8.1 0 0 1 2.39 5.78c0 4.5-3.67 8.18-8.17 8.18Zm4.48-6.1c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.96-.14.17-.28.19-.53.07-.25-.12-1.04-.38-1.98-1.23-.73-.65-1.22-1.45-1.36-1.69-.14-.25-.01-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.43 1.03 2.6c.12.17 1.76 2.69 4.27 3.77.6.26 1.07.42 1.44.53.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      </a>

      <HeroCarousel />

      <section ref={ipadCollectionRef} className="site-soft-band py-14 sm:py-16 lg:py-20 2xl:py-24">
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          <div>
            <p className="select-none text-[11px] font-bold uppercase tracking-[0.32em] text-forest/70 sm:text-xs sm:tracking-[0.35em] lg:text-sm">
              Shop By Category
            </p>
            <h2 className="select-none mt-2.5 bg-gradient-to-r from-forest via-citrus to-ember bg-clip-text text-[clamp(2.2rem,4.3vw,3.7rem)] font-light leading-[1.05] tracking-[-0.05em] text-transparent sm:mt-3">
              Explore Latest Devices
            </h2>
          </div>

          <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6 2xl:mt-9 2xl:gap-7">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white px-5 pb-5 pt-5 shadow-[0_12px_34px_rgba(15,23,42,0.055)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 sm:rounded-[1.75rem] sm:px-6 sm:pb-6 sm:pt-6 lg:rounded-[2rem] lg:px-7 lg:pb-7 lg:pt-7"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.06),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex min-h-[265px] flex-col justify-between min-[420px]:min-h-[285px] sm:min-h-[300px] md:min-h-[290px] lg:min-h-[300px] xl:min-h-[315px] 2xl:min-h-[325px]">
                  <div>
                    <p className="select-none text-[10px] font-bold uppercase tracking-[0.32em] text-forest/55 sm:text-[11px] sm:tracking-[0.34em]">
                      {category.eyebrow}
                    </p>
                    <h3 className="select-none mt-2.5 text-[2rem] font-light leading-none tracking-[-0.055em] text-slate-950 sm:mt-3 sm:text-[2.3rem] md:text-[2.15rem] lg:text-[2.25rem] xl:text-[2.45rem] 2xl:text-[2.6rem]">
                      {category.name}
                    </h3>
                  </div>

                  <div
                    className={`mt-3 flex min-h-0 flex-1 items-end justify-end sm:mt-4 md:pr-1 ${category.imageWrapClass}`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      {...deferredImageProps}
                      className={`pointer-events-none ml-auto w-[82%] origin-bottom-right select-none object-contain transition duration-500 group-hover:scale-[1.04] min-[420px]:w-[78%] sm:w-[76%] md:w-[84%] lg:w-[88%] xl:w-[84%] ${category.imageClass}`}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={upgradeSectionRef}
        className="relative isolate overflow-hidden bg-black pb-0 pt-5 text-white sm:pt-6 md:pt-7 lg:pt-8 2xl:pt-9"
        aria-labelledby="upgrade-section-title"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_8%,rgba(255,255,255,0.09),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

        <div className="relative z-10 mx-auto w-full max-w-[1920px]">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 md:px-8">
            <h2
              id="upgrade-section-title"
              ref={upgradeHeadingRef}
              className="text-[clamp(2.25rem,5.7vw,5.35rem)] font-light leading-[0.96] tracking-[-0.055em] text-white"
            >
              Upgrade to Something Better.
            </h2>
            <Link
              ref={upgradeCtaRef}
              to="/categories/iphone"
              className="group mt-2 inline-flex min-h-10 items-center gap-2.5 rounded-full px-3 text-[14px] font-semibold text-white transition duration-300 hover:bg-white/10 hover:text-white sm:mt-3 sm:gap-3 sm:px-4 sm:text-base md:mt-3 md:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Explore Upgrade Options</span>
              <span
                aria-hidden="true"
                className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl"
              >
                &rarr;
              </span>
            </Link>
          </div>

          <div className="relative mt-1 h-[150px] overflow-hidden min-[420px]:h-[170px] sm:mt-2 sm:h-[205px] md:mt-3 md:h-[235px] lg:h-[270px] xl:h-[295px] 2xl:mt-3 2xl:h-[315px]">
            <div className="absolute bottom-[8%] left-[3%] h-8 w-[42%] rounded-full bg-black/70 blur-[24px] sm:h-10 md:left-[8%] md:w-[36%] lg:left-[10%] lg:w-[32%] lg:blur-[32px]" />
            <div className="absolute bottom-[8%] right-[2%] h-8 w-[40%] rounded-full bg-black/70 blur-[24px] sm:h-10 md:right-[7%] md:w-[34%] lg:right-[9%] lg:w-[29%] lg:blur-[32px]" />

            <div
              ref={upgradeLeftRef}
              className="absolute bottom-0 left-[-17%] w-[76%] will-change-transform min-[420px]:left-[-15%] min-[420px]:w-[72%] sm:left-[-9%] sm:w-[62%] md:left-[-2%] md:w-[52%] lg:left-[5%] lg:w-[38%] xl:left-[7%] xl:w-[35%] 2xl:left-[8%] 2xl:w-[34%]"
            >
              <div ref={upgradeLeftInnerRef} className="will-change-transform">
                <img
                  src="/assets/upgrade-left-hand.png"
                  alt="Hand holding the old phone for a product upgrade"
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none w-full select-none object-contain"
                  draggable="false"
                />
              </div>
            </div>

            <div
              ref={upgradeRightRef}
              className="absolute bottom-0 right-[-17%] w-[75%] will-change-transform min-[420px]:right-[-15%] min-[420px]:w-[71%] sm:right-[-9%] sm:w-[61%] md:right-[-2%] md:w-[51%] lg:right-[5%] lg:w-[37%] xl:right-[7%] xl:w-[34%] 2xl:right-[8%] 2xl:w-[33%]"
            >
              <div ref={upgradeRightInnerRef} className="relative will-change-transform">
                <img
                  src="/assets/upgrade-right-hand.png"
                  alt="Hand holding the new phone box for a product upgrade"
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none w-full select-none object-contain"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="buying-guides" aria-labelledby="buying-guides-title" className="site-soft-band py-14 sm:py-16 lg:py-20 2xl:py-24">
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          <div className="max-w-5xl">
            <h2 id="buying-guides-title" className="text-[clamp(2.15rem,4.2vw,4rem)] font-light leading-[1.08] tracking-[-0.045em] text-slate-950">
              Buying guides. We&apos;ll help you decide today.
            </h2>
          </div>

          <div className="mt-7 grid items-stretch gap-4 sm:mt-9 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:mt-10 2xl:gap-7">
            {guideCards.map((card, index) => (
              <Link
                key={card.title}
                to={card.link}
                className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 sm:rounded-[1.75rem] lg:rounded-[2rem] ${
                  index === guideCards.length - 1
                    ? "md:col-span-2 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:col-span-1 xl:flex"
                    : ""
                }`}
              >
                <div
                  className={`p-5 sm:p-6 lg:p-7 2xl:p-8 ${
                    index === guideCards.length - 1 ? "md:flex md:flex-col md:justify-center xl:block" : ""
                  }`}
                >
                  <p
                    className={`bg-gradient-to-r ${card.accent} bg-clip-text text-[10px] font-bold uppercase tracking-[0.22em] text-transparent sm:text-[11px] sm:tracking-[0.26em] lg:text-xs lg:tracking-[0.28em]`}
                  >
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-md text-[1.65rem] font-light leading-[1.12] tracking-[-0.04em] text-slate-950 sm:mt-4 sm:text-[1.85rem] lg:text-[2rem] 2xl:text-[2.15rem]">
                    {card.title}
                  </h3>
                </div>

                <div
                  className={`relative mt-auto flex min-h-[220px] flex-1 items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-4 pb-0 pt-2 min-[420px]:min-h-[240px] sm:min-h-[260px] sm:px-5 md:min-h-[270px] lg:min-h-[290px] xl:min-h-[300px] 2xl:min-h-[320px] 2xl:px-6 ${
                    index === guideCards.length - 1 ? "md:mt-0 xl:mt-auto" : ""
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    {...deferredImageProps}
                    className="relative z-10 max-h-[210px] w-full select-none object-contain transition duration-300 group-hover:scale-[1.04] min-[420px]:max-h-[230px] sm:max-h-[250px] md:max-h-[260px] lg:max-h-[280px] xl:max-h-[290px] 2xl:max-h-[310px]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section ref={macCollectionRef} className="site-soft-band py-20">
        <div className="px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-4xl">
            <p className="select-none text-sm font-bold uppercase tracking-[0.35em] text-forest/70">
              Mac Collection
            </p>
            <h2 className="select-none mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950 md:text-5xl">
              Discover the Mac family.
            </h2>
          </div>

          <div
            className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5"
            style={{ contentVisibility: "auto", containIntrinsicSize: "320px 1600px" }}
          >
              {macShowcaseCards.map((card) => (
                <Link
                  key={card.name}
                  to={card.link}
                  data-mac-card
                  className="group overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative flex h-[230px] items-center justify-center overflow-hidden bg-white px-5 py-6">
                    <img
                      src={card.image}
                      alt={card.name}
                      {...deferredImageProps}
                      className="relative z-10 max-h-[185px] w-full object-contain transition duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="px-5 pb-5 pt-3 text-center">
                    <h3 className="text-lg font-light tracking-[-0.03em] text-slate-950 transition-colors duration-300 group-hover:text-forest">
                      {card.name}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>

        </div>
      </section>

      <section className="bg-black text-white">
        <img
          src="/assets/section-ipad-showcase-card.png"
          alt="Premium tablet power meets precision"
          {...deferredImageProps}
          className="block h-auto w-full"
        />
      </section>

      <section className="site-soft-band py-20">
        <div className="px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-forest/70">
              iPad Collection
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950 md:text-5xl">
              Explore the iPad lineup.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Discover compact, colorful, and pro-level iPad models in one clean premium showcase.
            </p>
          </div>

          <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-4 xl:overflow-visible">
            {ipadCollectionCards.map((card) => (
              <Link
                key={card.name}
                to={card.link}
                data-ipad-card
                className="group min-w-[280px] snap-start overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)] xl:min-w-0"
              >
                <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-6 py-8">
                  <div className="absolute inset-x-10 bottom-4 h-10 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.10),transparent_72%)] opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />
                  <img
                    src={card.image}
                    alt={card.name}
                    {...deferredImageProps}
                    className="relative z-10 max-h-[250px] w-full object-contain transition duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.06]"
                  />
                </div>
                <div className="border-t border-slate-100 px-6 pb-6 pt-5 text-center">
                  <h3 className="text-2xl font-light tracking-[-0.04em] text-slate-950 transition-colors duration-300 group-hover:text-forest">
                    {card.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ecosystem-cinema bg-black" aria-label="Samsung Ecosystem animated showcase">
        <img
          src="/assets/section-samsung-ecosystem.png"
          alt="Samsung Ecosystem"
          {...deferredImageProps}
          className="ecosystem-cinema__image"
        />
        <span className="ecosystem-cinema__ambient" aria-hidden="true" />
        <span className="ecosystem-cinema__sweep" aria-hidden="true" />
        <span className="ecosystem-cinema__final-sweep" aria-hidden="true" />
        <span className="ecosystem-cinema__headphone-pulse ecosystem-cinema__headphone-pulse--one" aria-hidden="true" />
        <span className="ecosystem-cinema__headphone-pulse ecosystem-cinema__headphone-pulse--two" aria-hidden="true" />
        <span className="ecosystem-cinema__earbud-wave ecosystem-cinema__earbud-wave--left" aria-hidden="true" />
        <span className="ecosystem-cinema__earbud-wave ecosystem-cinema__earbud-wave--right" aria-hidden="true" />
        <span className="ecosystem-cinema__case-led" aria-hidden="true" />
        <span className="ecosystem-cinema__tablet-glow" aria-hidden="true" />
        <span className="ecosystem-cinema__stylus-glow" aria-hidden="true" />
        <span className="ecosystem-cinema__watch-glow ecosystem-cinema__watch-glow--left" aria-hidden="true" />
        <span className="ecosystem-cinema__watch-glow ecosystem-cinema__watch-glow--right" aria-hidden="true" />
        <span className="ecosystem-cinema__phone-sweep ecosystem-cinema__phone-sweep--blue" aria-hidden="true" />
        <span className="ecosystem-cinema__phone-sweep ecosystem-cinema__phone-sweep--fold" aria-hidden="true" />
        <span className="ecosystem-cinema__phone-sweep ecosystem-cinema__phone-sweep--flip" aria-hidden="true" />
      </section>

      <section className="site-soft-band py-20">
        <div className="px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-forest/70">
              Samsung Collection
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950 md:text-5xl">
              Explore Samsung devices.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {samsungCollectionCards.map((card) => (
              <Link
                key={card.name}
                to={card.link}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
              >
                <div className="px-7 pb-2 pt-7">
                  <p className="text-[12px] font-bold uppercase tracking-[0.38em] text-forest/70">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-4 text-[2.15rem] font-light leading-none tracking-[-0.05em] text-slate-950 md:text-[2.45rem]">
                    {card.name}
                  </h3>
                </div>

                <div className="flex h-[260px] items-center justify-center bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-6 py-7 sm:h-[280px] lg:h-[290px]">
                  <img
                    src={card.image}
                    alt={card.name}
                    {...deferredImageProps}
                    className={`h-auto w-full object-contain transition duration-300 group-hover:scale-[1.03] ${card.imageClass}`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RepairHero />

      <section className="site-soft-band py-16 sm:py-20" aria-labelledby="device-essentials-title">
        <div className="px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-forest/70">
              Device Essentials
            </p>
            <h2
              id="device-essentials-title"
              className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950 md:text-5xl"
            >
              Shop by everyday device type.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.35fr)]">
            <Link
              to={activeDevice.link}
              className="group relative flex min-h-[360px] overflow-hidden rounded-[2rem] border border-forest/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:min-h-[430px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(216,255,238,0.95),transparent_34%),linear-gradient(135deg,#ffffff,#f8fffb_58%,#ffffff)]" />
              <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 text-2xl text-forest shadow-[inset_0_0_0_1px_rgba(16,185,129,0.16),0_14px_30px_rgba(15,23,42,0.08)]">
                    <ActiveDeviceIcon aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.32em] text-forest/70">
                    Featured Category
                  </p>
                  <h3 className="mt-3 text-4xl font-light tracking-[-0.05em] text-slate-950 sm:text-5xl">
                    {activeDevice.name}
                  </h3>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-[210px] w-full items-center justify-center overflow-hidden sm:h-[250px] lg:h-[260px] 2xl:h-[275px]">
                    <img
                      src={activeDevice.image}
                      alt={activeDevice.name}
                      {...deferredImageProps}
                      className="h-full w-full max-w-[78%] object-contain transition duration-500 group-hover:scale-[1.04] sm:max-w-[74%] xl:max-w-[72%]"
                    />
                  </div>
                  <div className="flex items-center gap-2" aria-label="Device category slideshow controls">
                    {deviceEssentials.map((category, index) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveDeviceIndex(index);
                        }}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === activeDeviceIndex
                            ? "w-8 bg-forest"
                            : "w-2.5 bg-forest/20 hover:bg-forest/40"
                        }`}
                        aria-label={`Show ${category.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
              {deviceEssentials.map((category, index) => {
                const isActive = index === activeDeviceIndex;

                return (
                  <Link
                    key={category.name}
                    to={category.link}
                    onMouseEnter={() => setActiveDeviceIndex(index)}
                    onFocus={() => setActiveDeviceIndex(index)}
                    className={`group flex min-h-[245px] flex-col justify-between overflow-hidden rounded-[1.5rem] border bg-white/92 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(15,23,42,0.11)] ${
                      isActive ? "border-forest/30" : "border-forest/10"
                    }`}
                  >
                    <span className="flex flex-1 items-center justify-center py-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        {...deferredImageProps}
                        className={`h-auto w-full object-contain transition duration-300 group-hover:scale-[1.05] ${category.imageClass}`}
                      />
                    </span>

                    <span className="block text-xl font-light tracking-[-0.04em] text-slate-950 md:text-2xl">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="site-soft-band pb-16 sm:pb-20 lg:pb-24" aria-label="Device collection highlights">
        <div className="px-4 sm:px-6 md:px-8 lg:hidden">
          <div className="grid gap-4">
            {deviceCollectionCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className={`group overflow-hidden rounded-[1.5rem] border border-slate-200 shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)] ${card.theme}`}
              >
                <div className="flex min-h-[330px] flex-col justify-between gap-5 p-6 min-[520px]:min-h-[300px] min-[520px]:flex-row min-[520px]:items-center">
                  <div className="relative z-10 min-w-0 min-[520px]:max-w-[48%]">
                    <h2 className="text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[2.45rem]">
                      {card.title}
                    </h2>
                    <p className={`mt-4 text-[15px] leading-7 ${card.theme.includes("text-white") ? "text-white/78" : "text-slate-600"}`}>
                      {card.description}
                    </p>
                    <span className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-ember px-5 text-sm font-semibold transition duration-300 group-hover:bg-ember group-hover:text-white">
                      {card.cta}
                    </span>
                  </div>

                  <div className="flex flex-1 items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.title}
                      {...deferredImageProps}
                      className={`h-auto w-full object-contain transition duration-300 group-hover:scale-[1.04] ${card.imageClass}`}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <img
          src="/assets/section-device-collection-fullwidth.png"
          alt="Apple and Samsung devices collection"
          {...deferredImageProps}
          className="hidden h-auto w-full lg:block"
        />
      </section>

    </main>
  );
}
