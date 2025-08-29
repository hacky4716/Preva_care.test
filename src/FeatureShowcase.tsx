// FeatureShowcase.tsx (fixed fullscreen + reliable right-side click)
import { useEffect, useRef, useState } from "react";
import "./FeatureShowcase.css";

interface Feature {
    id: number;
    feature: string;
    title: string;
    heading: string;
    description: string[];
    image: string;
}

const features: Feature[] = [
    {
        id: 1,
        feature: "Feature No. 1",
        title: "Login",
        heading: "SECURE LOGIN",
        description: [
            "Quick and safe login process",
            "Supports biometric authentication",
            "Encrypted credentials",
            "Contains option for forgot password with OTP Verification",
            "Contains direct link for Sign-up incase the user doesn't have an account."
        ], image: "/images/feature1.png"
    },
    {
        id: 2,
        feature: "Feature No. 2",
        title: "Authentication",
        heading: "UNLOCK SCREEN",
        description: [
            "Secure your access with a password.",
            "Protects your data from unauthorized users.",
            "Provides a simple and clean UI for logging in smoothly.",
            "Provides access to user for Sign-up if the user doesnt have an account yet."
        ], image: "/images/feature2.png"
    },
    {
        id: 3,
        feature: "Feature No. 3",
        title: "Weather",
        heading: "WEATHER SCREEN",
        description: [
            "Displays the current weather conditions with temperature and icon.",
            "Shows additional information like humidity, wind speed, and feels-like temperature.",
            "Provides a clean UI with gradient background for readability.",
            "Includes a forecast section for upcoming hours or days."
        ], image: "/images/feature3.png"
    },
    {
        id: 4,
        feature: "Feature No. 4",
        title: "Settings",
        heading: "SETTINGS SCREEN",
        description: [
            "Allows users to customize preferences such as theme and language.",
            "Provides control over notifications and privacy options.",
            "Clean and simple layout for easy navigation.",
            "Ensures a personalized experience tailored to the user’s needs."
        ], image: "/images/feature4.png"
    },
    {
        id: 5,
        feature: "Feature No. 5",
        title: "Home",
        heading: "HOME SCREEN",
        description: [
            "Serves as the central hub of the application.",
            "Displays quick access to key features like weather, profile, and settings.",
            "Provides a clean and intuitive user interface.",
            "Ensures seamless navigation to different sections of the app."
        ], image: "/images/feature5.png"
    },
];

const AUTOPLAY_DELAY = 2500;
const RESUME_DELAY = 3000;

export default function FeatureShowcase() {
    const [active, setActive] = useState(0);
    const [inView, setInView] = useState(false);
    const [paused, setPaused] = useState(false);

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const autoplayRef = useRef<number | null>(null);
    const resumeRef = useRef<number | null>(null);

    // Visibility observer
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.6),
            { threshold: [0, 0.6, 1] }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const clearAutoplay = () => {
        if (autoplayRef.current !== null) {
            window.clearTimeout(autoplayRef.current);
            autoplayRef.current = null;
        }
    };
    const clearResume = () => {
        if (resumeRef.current !== null) {
            window.clearTimeout(resumeRef.current);
            resumeRef.current = null;
        }
    };

    // Autoplay logic
    useEffect(() => {
        clearAutoplay();
        if (inView && !paused && active < features.length - 1) {
            autoplayRef.current = window.setTimeout(
                () => setActive((a) => a + 1),
                AUTOPLAY_DELAY
            );
        }
        return clearAutoplay;
    }, [inView, paused, active]);

    // Pause/resume autoplay
    const pauseBriefly = () => {
        setPaused(true);
        clearResume();
        resumeRef.current = window.setTimeout(() => setPaused(false), RESUME_DELAY);
    };

    // Navigation
    const goto = (idx: number) => {
        clearAutoplay();
        setActive(idx);
        pauseBriefly();
    };
    const prev = () => goto((active - 1 + features.length) % features.length);
    const next = () => goto((active + 1) % features.length);

    // Reset pause if section leaves screen
    useEffect(() => {
        if (!inView) {
            setPaused(false);
            clearAutoplay();
            clearResume();
        }
    }, [inView]);

// In your Features component
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (active < features.length - 1) {
      e.preventDefault();
      if (e.deltaY > 0) {
        setActive((prev) => Math.min(prev + 1, features.length - 1));
      } else {
        setActive((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  return () => window.removeEventListener("wheel", handleWheel);
}, [active, features.length]);

useEffect(() => {
  let startY = 0;
  const onTouchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
  const onTouchEnd = (e: TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - startY;
    if (Math.abs(deltaY) > 50) {
      if (deltaY < 0 && active < features.length - 1)
        setActive((a) => a + 1); // swipe up → next
      else if (deltaY > 0 && active > 0)
        setActive((a) => a - 1); // swipe down → prev
    }
  };
  window.addEventListener("touchstart", onTouchStart);
  window.addEventListener("touchend", onTouchEnd);
  return () => {
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
  };
}, [active]);


    return (
  <div className="container relative min-h-[500vh]">
    <div className="content sticky top-0 h-screen flex flex-col sm:flex-row justify-center sm:items-center p-6 sm:p-12 gap-6">
      {/* Left */}
      <div className="left w-full sm:w-1/4 flex flex-col">
        <h2 className="feature-title">{features[active].feature}-</h2>
        <h3>{features[active].heading}</h3>
        <ul className="mt-4 space-y-2">
          {features[active].description.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>

        <div className="left-arrows flex justify-center sm:justify-start gap-4 mt-6">
          <button
            className="p-4 sm:p-3 rounded-full bg-gray-200"
            onClick={prev}
            aria-label="Previous feature"
          >
            ←
          </button>
          <span className="separator">|</span>
          <button
            className="p-4 sm:p-3 rounded-full bg-gray-200"
            onClick={next}
            aria-label="Next feature"
          >
            →
          </button>
        </div>
      </div>

      {/* Center */}
      <div className="center w-full sm:w-1/2 flex justify-center my-6 sm:my-0">
        <img
          className="iphone w-full max-w-[250px] sm:max-w-[350px] object-contain h-auto"
          src={features[active].image}
          alt={features[active].heading}
        />
      </div>

      {/* Right */}
      <div className="right w-full sm:w-1/4 text-center sm:text-left mt-6 sm:mt-0">
        <h2 className="mb-4">Feature Showcase</h2>
        <ul className="space-y-2">
          {features.map((f, idx) => (
            <li
              key={f.id}
              className={`cursor-pointer ${idx === active ? "active font-bold" : ""}`}
              onClick={() => goto(idx)}
            >
              Feature {f.id} : {f.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
}