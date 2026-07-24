"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Beaker,
  ClipboardCheck,
  Factory,
  FileSearch,
  Lightbulb,
  PackageCheck,
  Plane,
  Quote,
  Ship,
} from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { workflowSteps } from "@/lib/v2-content";

const icons = [
  Lightbulb,
  FileSearch,
  Factory,
  Quote,
  Beaker,
  PackageCheck,
  ClipboardCheck,
  Ship,
  Plane,
] as const;

function FlowArrow({
  dir,
  lit,
}: {
  dir: "right" | "left" | "down";
  lit: boolean;
}) {
  const Icon = dir === "right" ? ArrowRight : dir === "left" ? ArrowLeft : ArrowDown;
  return (
    <motion.span
      aria-hidden
      className={cn("workflow-arrow", lit && "workflow-arrow-active")}
      animate={
        lit
          ? { scale: [1, 1.18, 1], x: dir === "right" ? [0, 3, 0] : dir === "left" ? [0, -3, 0] : 0, y: dir === "down" ? [0, 3, 0] : 0 }
          : { scale: 1, opacity: 0.4 }
      }
      transition={lit ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.6} />
    </motion.span>
  );
}

function StepCard({
  index,
  active,
  onSelect,
}: {
  index: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const step = workflowSteps[index];
  const Icon = icons[index] ?? Lightbulb;
  const isActive = active === index;
  const isDone = index < active;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(index)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "workflow-step relative w-full overflow-hidden rounded-[1.35rem] p-4 text-left sm:p-5",
        isActive && "workflow-step-active",
        (index === 0 || index === workflowSteps.length - 1) && "workflow-step-accent",
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition sm:h-12 sm:w-12",
            isActive
              ? "bg-accent text-white shadow-[0_12px_28px_rgba(214,0,0,0.28)]"
              : isDone
                ? "bg-accent-soft text-accent"
                : "bg-accent-soft text-accent",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 font-mono text-[10px] font-semibold text-paper">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="font-display text-lg font-semibold tracking-tight text-ink">{step.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
        </div>
      </div>
      {isActive ? (
        <motion.span
          layoutId="workflow-ring"
          className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-2 ring-accent/55"
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
      ) : null}
    </motion.button>
  );
}

export function V2Workflow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % workflowSteps.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [paused]);

  const progress = ((active + 1) / workflowSteps.length) * 100;

  function select(i: number) {
    setActive(i);
    setPaused(true);
  }

  return (
    <section id="workflow" className="scroll-mt-28 border-t border-line bg-[#fafafa] py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Workflow</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Idea to delivery — one timeline
          </h2>
          <p className="mt-3 text-muted sm:mt-4 sm:text-lg">
            From the first sketch or SKU brief to goods at your door — one controlled path with
            Seven Color on the ground in China.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-5xl sm:mt-10">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
            <span className="text-muted">Live path</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="truncate text-accent"
              >
                Step {String(active + 1).padStart(2, "0")} · {workflowSteps[active].title}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#b40000] via-[#d60000] to-[#ff5a5a]"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            <motion.span
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(214,0,0,0.35)]"
              initial={false}
              animate={{ left: `calc(${Math.min(progress, 100)}% - 6px)` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        {/* Mobile vertical timeline with arrows */}
        <div
          className="mx-auto mt-8 flex max-w-xl flex-col items-stretch gap-2 lg:hidden"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {workflowSteps.map((_, i) => (
            <div key={workflowSteps[i].title} className="flex flex-col items-center gap-2">
              <StepCard index={i} active={active} onSelect={select} />
              {i < workflowSteps.length - 1 ? <FlowArrow dir="down" lit={active === i} /> : null}
            </div>
          ))}
        </div>

        {/* Desktop snake: 1→2→3, down, 6←5←4, down, 7→8→9 */}
        <div
          className="relative mx-auto mt-10 hidden max-w-5xl flex-col gap-2 lg:flex"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-2">
            <StepCard index={0} active={active} onSelect={select} />
            <FlowArrow dir="right" lit={active === 0} />
            <StepCard index={1} active={active} onSelect={select} />
            <FlowArrow dir="right" lit={active === 1} />
            <StepCard index={2} active={active} onSelect={select} />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-2">
            <span />
            <span />
            <span />
            <span />
            <div className="flex justify-center py-1">
              <FlowArrow dir="down" lit={active === 2} />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-2">
            <StepCard index={5} active={active} onSelect={select} />
            <FlowArrow dir="left" lit={active === 4} />
            <StepCard index={4} active={active} onSelect={select} />
            <FlowArrow dir="left" lit={active === 3} />
            <StepCard index={3} active={active} onSelect={select} />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-2">
            <div className="flex justify-center py-1">
              <FlowArrow dir="down" lit={active === 5} />
            </div>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-2">
            <StepCard index={6} active={active} onSelect={select} />
            <FlowArrow dir="right" lit={active === 6} />
            <StepCard index={7} active={active} onSelect={select} />
            <FlowArrow dir="right" lit={active === 7} />
            <StepCard index={8} active={active} onSelect={select} />
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            Hover or tap a step to pause · path auto-plays Idea → Delivered
          </p>
        </div>
      </Container>
    </section>
  );
}
