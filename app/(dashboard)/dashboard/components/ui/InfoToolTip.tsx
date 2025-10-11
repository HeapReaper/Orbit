"use client";

import { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
  size?: number;
}

export default function InfoTooltip({ text, size = 20 }: InfoTooltipProps) {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <Info
        className="text-[var(--primary-color)] hover:text-[var(--hover-color)] cursor-pointer mt-0.5"
        size={size}
        onClick={() => setShow(!show)}
      />

      {show && (
        <div className="absolute z-10 top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 bg-gray-800 text-gray-100 text-sm rounded shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}
