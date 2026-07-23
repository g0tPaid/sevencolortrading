"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function SourcingTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-step]",
        { opacity: 0.35, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );
      gsap.fromTo(
        "[data-progress]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      <div className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-line md:left-1/2 md:block" />
      <div
        data-progress
        className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-accent md:left-1/2 md:block"
        style={{ transform: "scaleY(0)" }}
        aria-hidden
      />
      <ol className="space-y-8 md:space-y-12">
        {timeline.map((item, index) => (
          <li
            key={item.step}
            data-step
            className={`relative grid gap-4 md:grid-cols-2 md:gap-10 ${
              index % 2 === 1 ? "md:text-right" : ""
            }`}
          >
            <div className={index % 2 === 1 ? "md:order-2 md:text-left" : ""}>
              <p className="font-mono text-xs text-accent">{item.step} · {item.duration}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                {item.description}
              </p>
            </div>
            <div
              className={`hidden md:block ${index % 2 === 1 ? "md:order-1" : ""}`}
              aria-hidden
            />
            <span className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent map-dot md:left-1/2" />
          </li>
        ))}
      </ol>
    </div>
  );
}
