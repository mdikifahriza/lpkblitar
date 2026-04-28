"use client";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/6281234567890"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] flex items-center justify-center ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
