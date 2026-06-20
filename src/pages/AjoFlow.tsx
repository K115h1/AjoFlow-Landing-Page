import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Wallet,
  RefreshCw,
  Bell,
  Lock,
  ChevronRight,
  Smartphone,
  TrendingUp,
  CheckCircle2,
  Star,
  Menu,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------
   AjoFlow — landing page
   Palette: white base / forest green / warm yellow / mint + paper tints
   Display: Space Grotesk · Body: Inter · Ledger/mono: JetBrains Mono
   Signature element: the rotating contribution wheel in the hero
------------------------------------------------------------------- */

const FONT_LINKS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-ledger { font-family: 'JetBrains Mono', monospace; }

    html { scroll-behavior: smooth; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    .grain {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    }

    .focus-ring:focus-visible {
      outline: 2px solid #1B7A43;
      outline-offset: 3px;
      border-radius: 4px;
    }
  `}</style>
);

/* ---------------- Naira amount ticking display ---------------- */
function useCountUp(target: number, trigger: boolean, duration = 1.4) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration,
      ease: "power2.out",
      onUpdate: () => setValue(Math.round(obj.v)),
    });
  }, [trigger, target, duration]);
  return value;
}

function nairaFmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "How it works", href: "#how" },
    { label: "Why AjoFlow", href: "#why" },
    { label: "Circles", href: "#circles" },
    { label: "Trust", href: "#trust" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg text-[#0B1F12] focus-ring">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1B7A43]">
            <RefreshCw className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          AjoFlow
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm text-[#0B1F12]/70 hover:text-[#0B1F12] transition-colors focus-ring"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#join"
            className="font-body text-sm font-medium text-[#0B1F12]/80 hover:text-[#0B1F12] px-3 py-2 transition-colors focus-ring"
          >
            Log in
          </a>
          <a
            href="#join"
            className="font-body text-sm font-semibold bg-[#0B1F12] text-white px-4 py-2.5 rounded-full hover:bg-[#1B7A43] transition-colors focus-ring"
          >
            Start a circle
          </a>
        </div>

        <button
          className="md:hidden p-2 text-[#0B1F12] focus-ring"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-[#0B1F12]/10 px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-body text-[#0B1F12]/80 py-3 border-b border-[#0B1F12]/5 focus-ring"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setOpen(false)}
            className="font-body font-semibold bg-[#0B1F12] text-white text-center px-4 py-3 rounded-full mt-3 focus-ring"
          >
            Start a circle
          </a>
        </div>
      )}
    </header>
  );
}

/* ---------------- Rotation Wheel — the signature element ---------------- */
function RotationWheel() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const potRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [potTrigger, setPotTrigger] = useState(false);
  const pot = useCountUp(480000, potTrigger, 1.6);

  const members = [
    { initials: "TA", name: "Tobi" },
    { initials: "FK", name: "Funke" },
    { initials: "CN", name: "Chidi" },
    { initials: "BE", name: "Blessing" },
    { initials: "SU", name: "Sade" },
    { initials: "MO", name: "Musa" },
  ];

  useEffect(() => {
    setPotTrigger(true);
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % members.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [members.length]);

  useLayoutEffect(() => {
    if (!wheelRef.current) return;
    gsap.to(wheelRef.current, {
      rotate: -(activeIdx * (360 / members.length)),
      duration: 1.1,
      ease: "power3.inOut",
    });
  }, [activeIdx, members.length]);

  const radius = 132;
  const n = members.length;

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto select-none" aria-hidden="true">
      {/* outer ambient ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#EAF7EE] to-white border border-[#1B7A43]/10" />

      {/* rotating member ring */}
      <div
        ref={wheelRef}
        className="absolute inset-0"
        style={{ transformOrigin: "50% 50%" }}
      >
        {members.map((m, i) => {
          const angle = (360 / n) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + (radius / 4.2) * Math.cos(rad);
          const y = 50 + (radius / 4.2) * Math.sin(rad);
          const isActive = i === activeIdx;
          return (
            <div
              key={m.initials}
              className="absolute flex flex-col items-center gap-1"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center font-display font-semibold text-sm border-2 transition-colors duration-500 ${
                  isActive
                    ? "bg-[#F2C200] border-[#F2C200] text-[#0B1F12] shadow-lg shadow-[#F2C200]/40 scale-110"
                    : "bg-white border-[#1B7A43]/20 text-[#0B1F12]/60"
                }`}
                style={{
                  transform: `rotate(${-angle - 90}deg) ${isActive ? "scale(1.1)" : ""}`,
                }}
              >
                <span style={{ transform: `rotate(${angle + 90}deg)` }}>{m.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* center pot */}
      <div
        ref={potRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-xl border border-[#0B1F12]/5 text-center px-3">
          <span className="font-body text-[10px] uppercase tracking-wider text-[#0B1F12]/40 mb-1">
            This cycle's payout
          </span>
          <span className="font-ledger font-semibold text-2xl text-[#0B1F12] tabular-nums">
            {nairaFmt(pot)}
          </span>
          <span className="font-body text-[11px] text-[#1B7A43] font-medium mt-1">
            → {members[activeIdx].name}'s turn
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const wheelWrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(badgeRef.current, { y: 14, opacity: 0, duration: 0.6 })
      .from(
        headlineRef.current?.querySelectorAll(".line") ?? [],
        { y: 36, opacity: 0, duration: 0.8, stagger: 0.1 },
        "-=0.3"
      )
      .from(subRef.current, { y: 16, opacity: 0, duration: 0.7 }, "-=0.4")
      .from(ctaRef.current, { y: 16, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(
        wheelWrapRef.current,
        { scale: 0.85, opacity: 0, duration: 1, ease: "power3.out" },
        "-=0.9"
      );
  }, []);

  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* soft background field */}
      <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-[#EAF7EE] blur-3xl opacity-70 -z-10" />
      <div className="absolute top-20 -left-40 w-[420px] h-[420px] rounded-full bg-[#FCF3D6] blur-3xl opacity-60 -z-10" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#EAF7EE] text-[#1B7A43] font-body text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B7A43]" />
            Built for the Nigerian ajo, made digital
          </div>

          <h1
            ref={headlineRef}
            className="font-display font-semibold text-[#0B1F12] text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight"
          >
            <span className="line block overflow-hidden">Your turn always comes.</span>
            <span className="line block overflow-hidden">Now it comes</span>
            <span className="line block overflow-hidden">
              <span className="text-[#1B7A43]">on time, every time.</span>
            </span>
          </h1>

          <p ref={subRef} className="font-body text-[#0B1F12]/65 text-lg mt-6 max-w-md leading-relaxed">
            AjoFlow takes the contribution circle your family has trusted for
            generations and gives it a ledger that never forgets, a payout
            that never slips, and a circle that can't disappear with the pot.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mt-9">
            <a
              href="#join"
              className="inline-flex items-center gap-2 bg-[#1B7A43] text-white font-body font-semibold px-6 py-3.5 rounded-full hover:bg-[#0B1F12] transition-colors focus-ring"
            >
              Start your circle
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 text-[#0B1F12] font-body font-semibold px-2 py-3.5 hover:text-[#1B7A43] transition-colors focus-ring"
            >
              See how it works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#0B1F12]/8">
            <div>
              <p className="font-display font-semibold text-2xl text-[#0B1F12]">₦2.1B+</p>
              <p className="font-body text-xs text-[#0B1F12]/50">moved through circles</p>
            </div>
            <div className="w-px h-9 bg-[#0B1F12]/10" />
            <div>
              <p className="font-display font-semibold text-2xl text-[#0B1F12]">14,000+</p>
              <p className="font-body text-xs text-[#0B1F12]/50">active members</p>
            </div>
            <div className="w-px h-9 bg-[#0B1F12]/10" />
            <div>
              <p className="font-display font-semibold text-2xl text-[#0B1F12]">0</p>
              <p className="font-body text-xs text-[#0B1F12]/50">missed payouts</p>
            </div>
          </div>
        </div>

        <div ref={wheelWrapRef} className="relative">
          <RotationWheel />
          <p className="text-center font-body text-xs text-[#0B1F12]/40 mt-4">
            A live circle of 6 — one payout rotates through every cycle
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".step-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  const steps = [
    {
      n: "01",
      title: "Form your circle",
      body: "Invite the people you already trust — family, coworkers, your church group. Set the contribution amount and how often it's collected.",
      icon: Users,
    },
    {
      n: "02",
      title: "Contribute on schedule",
      body: "Everyone pays into the same pot, automatically, on the date your circle agrees on. AjoFlow tracks every contribution against every member.",
      icon: Wallet,
    },
    {
      n: "03",
      title: "Collect on your turn",
      body: "The full pot moves to whoever's turn it is, the moment the cycle closes. No chasing, no excuses, no one holding the money longer than they should.",
      icon: RefreshCw,
    },
  ];

  return (
    <section id="how" className="py-24 sm:py-32 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-16">
          <span className="font-ledger text-xs uppercase tracking-widest text-[#1B7A43] font-semibold">
            The cycle
          </span>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[#0B1F12] mt-3 leading-tight">
            Three steps. Same trust your grandmother's ajo ran on.
          </h2>
        </div>

        <div ref={sectionRef} className="grid sm:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="step-card bg-white rounded-2xl p-7 border border-[#0B1F12]/8 hover:border-[#1B7A43]/30 hover:shadow-lg hover:shadow-[#1B7A43]/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-ledger text-xs text-[#0B1F12]/30 font-semibold">{s.n}</span>
                <div className="w-10 h-10 rounded-full bg-[#EAF7EE] flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-[#1B7A43]" strokeWidth={2} />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#0B1F12] mb-2">{s.title}</h3>
              <p className="font-body text-sm text-[#0B1F12]/60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why AjoFlow / features ---------------- */
function WhySection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll(".feat");
    if (!items) return;
    gsap.fromTo(
      items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      }
    );
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "No vanishing organizers",
      body: "Every kobo is logged against the circle, not held by one person's word. The ledger settles disputes instantly.",
    },
    {
      icon: Bell,
      title: "Reminders that actually land",
      body: "SMS and push nudges before each contribution is due — in the language and tone your circle is used to.",
    },
    {
      icon: TrendingUp,
      title: "A trust score you can carry",
      body: "Pay your turns on time and build a record you can show the next circle, or use toward a loan.",
    },
    {
      icon: Lock,
      title: "Your money, not ours",
      body: "Contributions sit in a regulated escrow account. AjoFlow never holds your pot — it only moves it on schedule.",
    },
    {
      icon: Smartphone,
      title: "Works on the network you have",
      body: "Built lightweight for 3G. Contribute by app, USSD, or bank transfer — whichever reaches your members.",
    },
    {
      icon: Users,
      title: "Built for the size you run",
      body: "From a 5-person family circle to a 50-person office contribution scheme — the math holds either way.",
    },
  ];

  return (
    <section id="why" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <span className="font-ledger text-xs uppercase tracking-widest text-[#1B7A43] font-semibold">
              Why circles move to AjoFlow
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[#0B1F12] mt-3 leading-tight">
              Everything that made ajo work, minus what made it risky.
            </h2>
          </div>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0B1F12]/8 rounded-2xl overflow-hidden border border-[#0B1F12]/8">
          {features.map((f) => (
            <div key={f.title} className="feat bg-white p-8 hover:bg-[#FAFCFA] transition-colors">
              <f.icon className="w-6 h-6 text-[#1B7A43] mb-4" strokeWidth={1.8} />
              <h3 className="font-display font-semibold text-base text-[#0B1F12] mb-2">{f.title}</h3>
              <p className="font-body text-sm text-[#0B1F12]/60 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Circle types / showcase ---------------- */
function CirclesShowcase() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = ref.current?.querySelectorAll(".circle-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      }
    );
  }, []);

  const circles = [
    {
      name: "Family circle",
      members: 8,
      amount: "₦25,000",
      freq: "Weekly",
      color: "#1B7A43",
    },
    {
      name: "Office contribution",
      members: 22,
      amount: "₦15,000",
      freq: "Monthly",
      color: "#F2C200",
    },
    {
      name: "Market traders' ajo",
      members: 40,
      amount: "₦5,000",
      freq: "Daily",
      color: "#0B1F12",
    },
  ];

  return (
    <section id="circles" className="py-24 sm:py-32 bg-[#0B1F12] relative overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
        <div className="max-w-xl mb-16">
          <span className="font-ledger text-xs uppercase tracking-widest text-[#F2C200] font-semibold">
            One system, every kind of circle
          </span>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-white mt-3 leading-tight">
            However your people save, AjoFlow keeps the rhythm.
          </h2>
        </div>

        <div ref={ref} className="grid sm:grid-cols-3 gap-6">
          {circles.map((c) => (
            <div
              key={c.name}
              className="circle-card bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm"
            >
              <div
                className="w-10 h-10 rounded-full mb-6"
                style={{ background: c.color }}
              />
              <h3 className="font-display font-semibold text-lg text-white mb-4">{c.name}</h3>
              <div className="space-y-2.5 font-body text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Members</span>
                  <span className="font-ledger text-white/80">{c.members}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Contribution</span>
                  <span className="font-ledger text-white/80">{c.amount}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Frequency</span>
                  <span className="font-ledger text-white/80">{c.freq}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust / testimonial ---------------- */
function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section id="trust" className="py-24 sm:py-32 bg-[#FCF3D6]/40">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center" ref={ref}>
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F2C200] text-[#F2C200]" />
          ))}
        </div>
        <p className="font-display text-2xl sm:text-3xl text-[#0B1F12] leading-snug max-w-2xl mx-auto">
          "My mother ran her ajo with a notebook for thirty years. I run mine
          with AjoFlow — same trust, none of the worry about who's keeping
          the book honest."
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <div className="w-10 h-10 rounded-full bg-[#1B7A43] flex items-center justify-center font-display font-semibold text-white text-sm">
            AO
          </div>
          <div className="text-left">
            <p className="font-body font-semibold text-sm text-[#0B1F12]">Amaka O.</p>
            <p className="font-body text-xs text-[#0B1F12]/50">Runs a 12-member family circle, Lagos</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mt-14 pt-10 border-t border-[#0B1F12]/8">
          {[
            "Licensed escrow partner",
            "Bank-level encryption",
            "Built & based in Lagos",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 font-body text-sm text-[#0B1F12]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B7A43]" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { scale: 0.96, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      }
    );
  }, []);

  return (
    <section id="join" className="py-20 sm:py-28 px-5 sm:px-8">
      <div
        ref={ref}
        className="max-w-5xl mx-auto bg-[#1B7A43] rounded-3xl px-8 sm:px-16 py-16 sm:py-20 text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#F2C200]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-white max-w-xl mx-auto leading-tight relative">
          Your circle has been waiting for this.
        </h2>
        <p className="font-body text-white/75 mt-4 max-w-md mx-auto relative">
          Set it up in under five minutes. Invite the people who already
          trust you with their money.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-9 relative">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F12] font-body font-semibold px-7 py-3.5 rounded-full hover:bg-[#F2C200] transition-colors focus-ring"
          >
            Start your circle
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 text-white font-body font-semibold px-4 py-3.5 hover:text-[#F2C200] transition-colors focus-ring"
          >
            Talk to us first
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="bg-white border-t border-[#0B1F12]/8 py-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-[#0B1F12] mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1B7A43]">
                <RefreshCw className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </span>
              AjoFlow
            </div>
            <p className="font-body text-sm text-[#0B1F12]/50 leading-relaxed">
              Digital ajo for circles that run on trust — and now, a ledger
              that backs it up. Built in Lagos.
            </p>
          </div>

          <div className="flex flex-wrap gap-10">
            <div>
              <p className="font-body font-semibold text-sm text-[#0B1F12] mb-3">Product</p>
              <ul className="space-y-2 font-body text-sm text-[#0B1F12]/55">
                <li><a href="#how" className="hover:text-[#1B7A43] focus-ring">How it works</a></li>
                <li><a href="#why" className="hover:text-[#1B7A43] focus-ring">Features</a></li>
                <li><a href="#circles" className="hover:text-[#1B7A43] focus-ring">Circle types</a></li>
              </ul>
            </div>
            <div>
              <p className="font-body font-semibold text-sm text-[#0B1F12] mb-3">Company</p>
              <ul className="space-y-2 font-body text-sm text-[#0B1F12]/55">
                <li><a href="#" className="hover:text-[#1B7A43] focus-ring">About</a></li>
                <li><a href="#trust" className="hover:text-[#1B7A43] focus-ring">Trust & safety</a></li>
                <li><a href="#" className="hover:text-[#1B7A43] focus-ring">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mt-12 pt-8 border-t border-[#0B1F12]/8">
          <p className="font-body text-xs text-[#0B1F12]/40">
            © 2026 AjoFlow. Made for the Nigerian ajo system.
          </p>
          <div className="flex gap-6 font-body text-xs text-[#0B1F12]/40">
            <a href="#" className="hover:text-[#1B7A43] focus-ring">Privacy</a>
            <a href="#" className="hover:text-[#1B7A43] focus-ring">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Root ---------------- */
export default function AjoFlow() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="font-body bg-white text-[#0B1F12] antialiased">
      {FONT_LINKS}
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <WhySection />
        <CirclesShowcase />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
