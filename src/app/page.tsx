"use client";

import React, { useEffect, useRef, useState } from "react";
import Stage from "@/components/Stage";
import Reveal from "@/components/Reveal";
import { stage, VARIANTS } from "@/lib/stage";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - t0) / 1300, 1);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const ANATOMY = [
  { n: "01", part: "Graphene driver", spec: "40 mm · 8 Hz – 40 kHz", d: "A graphene-coated diaphragm that stays rigid at full excursion — bass you feel in your chest, treble that never turns harsh." },
  { n: "02", part: "ANC mic ring", spec: "8 microphones · −48 dB", d: "Eight mics sample the world 48,000 times a second and erase it. Planes, traffic and office chatter simply stop existing." },
  { n: "03", part: "Memory-foam cushion", spec: "Protein leather", d: "Slow-rebound foam wrapped in protein leather, shaped from 2,000 ear scans. Seals softly, breathes for hours." },
  { n: "04", part: "Aluminium yoke", spec: "CNC-milled · steel core", d: "A milled aluminium yoke over a spring-steel core — the hinge is rated for 30,000 folds and feels like a camera lens." },
  { n: "05", part: "Battery cell", spec: "40 h · USB-C fast charge", d: "Forty hours with ANC on. Ten minutes plugged in buys five more hours — a coffee, not a charging session." },
];

const SPECS = [
  { v: 40, s: "h", label: "Battery life", sub: "ANC on, single charge" },
  { v: 48, s: " dB", label: "Noise erased", sub: "Adaptive ANC, −48 dB peak", neg: true },
  { v: 40, s: " mm", label: "Graphene driver", sub: "8 Hz – 40 kHz response" },
  { v: 248, s: " g", label: "Total weight", sub: "Lighter than your phone" },
  { v: 36, s: "", label: "Components", sub: "Every one replaceable" },
  { v: 10, s: " min", label: "= 5 hours play", sub: "USB-C fast charge" },
];

export default function Page() {
  const [variant, setVariant] = useState(0);
  const [reserved, setReserved] = useState(false);

  useEffect(() => { stage.variant = variant; }, [variant]);

  const jumpToFinishes = (i: number) => {
    setVariant(i);
    const el = document.getElementById("stage3d");
    if (el) window.scrollTo({ top: el.offsetTop + window.innerHeight * 2.35, behavior: "smooth" });
  };

  return (
    <main>
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <a href="#" className="font-display font-bold text-xl tracking-tight">SONUS<span className="text-accent">.</span></a>
          <nav className="hidden md:flex gap-8 font-mono text-[11px] tracking-[0.25em] text-cream/60">
            <a href="#anatomy" className="hover:text-accent transition">ANATOMY</a>
            <a href="#specs" className="hover:text-accent transition">SPECS</a>
            <a href="#finishes" className="hover:text-accent transition">FINISHES</a>
          </nav>
          <a href="#reserve" className="rounded-full bg-cream text-ink font-display font-semibold text-sm px-5 py-2 hover:bg-accent transition">Reserve — $349</a>
        </div>
      </header>

      <Stage variant={variant} setVariant={setVariant} />

      {/* Marquee */}
      <div className="border-y border-white/8 py-4 overflow-hidden bg-panel/60">
        <div className="marquee-track flex whitespace-nowrap font-display font-semibold text-lg md:text-xl text-cream/80 w-max">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {["ADAPTIVE ANC −48 DB", "40-HOUR BATTERY", "SPATIAL AUDIO", "REAL 3D — NOT A VIDEO", "USB-C FAST CHARGE", "36 REPLACEABLE PARTS"].map((t) => (
                <span key={t} className="mx-6 flex items-center gap-12">{t}<span className="text-accent">·</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Anatomy */}
      <section id="anatomy" className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div className="lg:sticky lg:top-28 self-start">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent">03 · ANATOMY</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.0] mt-4">Inside the One. Every layer, labelled.</h2>
            <p className="text-muted mt-5 leading-relaxed max-w-md">Scroll back up and hit <span className="text-cream font-medium">Exploded view</span> — every part below is a real piece of the model you just pulled apart.</p>
          </Reveal>
        </div>
        <div>
          {ANATOMY.map((a, i) => (
            <Reveal key={a.n} delay={i * 70}>
              <article className="group border-t border-white/10 py-7 flex gap-6 hover:bg-panel/60 transition px-3 -mx-3 rounded-lg">
                <span className="font-mono text-accent text-sm pt-1">{a.n}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold group-hover:text-accent transition">{a.part}</h3>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-cream/50 mt-1">{a.spec.toUpperCase()}</p>
                  <p className="text-muted mt-3 leading-relaxed max-w-xl">{a.d}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="border-y border-white/8 bg-panel/40">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-28">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent">04 · NUMBERS</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">Specs that sell themselves.</h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {SPECS.map((s, i) => (
              <Reveal key={s.label} delay={i * 60}>
                <div className="rounded-2xl border border-white/10 bg-panel p-6 md:p-8 h-full hover:border-accent/50 transition">
                  <p className="font-display text-4xl md:text-6xl font-bold">{s.neg ? "−" : ""}<CountUp to={s.v} suffix={s.s} /></p>
                  <p className="font-display font-semibold mt-3">{s.label}</p>
                  <p className="text-muted text-sm mt-1">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Finishes */}
      <section id="finishes" className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.35em] text-accent">05 · FINISHES</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">Pick yours. Watch it change.</h2>
          <p className="text-muted mt-4 max-w-lg leading-relaxed">Tap a finish and the 3D model above repaints itself in that exact material — shell, band and accent ring.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {VARIANTS.map((v, i) => (
            <Reveal key={v.name} delay={i * 70}>
              <button onClick={() => jumpToFinishes(i)} className={`w-full text-left rounded-2xl border p-6 transition group ${variant === i ? "border-accent bg-panel" : "border-white/10 bg-panel/50 hover:border-white/30"}`}>
                <span className="flex gap-2">
                  <span className="w-9 h-9 rounded-full border border-white/15" style={{ background: v.shell }} />
                  <span className="w-9 h-9 rounded-full border border-white/15" style={{ background: v.band }} />
                  <span className="w-9 h-9 rounded-full border border-white/15" style={{ background: v.accent }} />
                </span>
                <span className="block font-display text-xl font-semibold mt-5 group-hover:text-accent transition">{v.name}</span>
                <span className="block text-muted text-sm mt-1">${v.price} · Free shipping</span>
                <span className="block font-mono text-[10px] tracking-[0.25em] text-accent mt-4">{variant === i ? "ON THE MODEL NOW" : "PUT IT ON THE MODEL"}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" className="border-t border-white/8 bg-panel/40">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-28 grid lg:grid-cols-2 gap-12">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent">06 · RESERVE</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.0] mt-4">Quiet is the new loud.</h2>
            <p className="text-muted mt-5 leading-relaxed max-w-md">Reserve a SONUS One in {VARIANTS[variant].name} today. No payment now — we email you when your pair leaves the studio.</p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Free worldwide shipping", "45-day home trial — love it or send it back", "2-year warranty, every part replaceable", "Ships in plastic-free packaging"].map((t) => (
                <li key={t} className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            {reserved ? (
              <div className="rounded-2xl border border-accent/50 bg-panel p-8 md:p-10 text-center">
                <p className="font-display text-3xl font-bold">You are on the list.</p>
                <p className="text-muted mt-3">A {VARIANTS[variant].name} SONUS One is held for you. Watch your inbox — and go spin the model once more while you wait.</p>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-6 rounded-full bg-accent text-ink font-display font-semibold px-6 py-3 hover:brightness-110 transition">Back to the 3D stage</button>
              </div>
            ) : (
              <form className="rounded-2xl border border-white/10 bg-panel p-8 md:p-10 space-y-4" onSubmit={(e) => { e.preventDefault(); setReserved(true); }}>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cream/50">YOUR NAME</span>
                  <input required placeholder="Alex Rivera" className="mt-2 w-full rounded-xl bg-ink border border-white/10 px-4 py-3 outline-none focus:border-accent transition placeholder:text-cream/25" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cream/50">EMAIL</span>
                  <input required type="email" placeholder="alex@email.com" className="mt-2 w-full rounded-xl bg-ink border border-white/10 px-4 py-3 outline-none focus:border-accent transition placeholder:text-cream/25" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cream/50">FINISH</span>
                  <select value={variant} onChange={(e) => setVariant(Number(e.target.value))} className="mt-2 w-full rounded-xl bg-ink border border-white/10 px-4 py-3 outline-none focus:border-accent transition">
                    {VARIANTS.map((v, i) => <option key={v.name} value={i}>{v.name} — ${v.price}</option>)}
                  </select>
                </label>
                <button className="w-full rounded-full bg-accent text-ink font-display font-bold text-base py-3.5 hover:brightness-110 transition">Reserve my SONUS One</button>
                <p className="text-center text-muted text-xs">Demo storefront — no payment is taken.</p>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-14">
          <p className="font-display font-bold text-[18vw] md:text-[9rem] leading-none text-white/5 select-none">SONUS.</p>
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 text-sm text-muted">
            <p>SONUS One — a concept product site with a real-time 3D model (Three.js / WebGL). No product videos, no photos: every angle is rendered live.</p>
            <p className="shrink-0">Designed & built by Ali Rizwan</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
