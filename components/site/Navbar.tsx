import Link from "next/link";

const navLinks = [
  { href: "/systems", label: "Systems", variant: "default" },
  { href: "/claim", label: "Claim", variant: "default" },
  { href: "/web3", label: "Web3", variant: "default" },
  { href: "/waitlist", label: "Waitlist", variant: "highlight" },
  { href: "/game", label: "Play", variant: "cta" },
] as const;

const variantClass = {
  default:
    "border-2 border-[#08080d] bg-[#fff4c4] px-3 py-2 text-[#1b2b72] shadow-[3px_3px_0_#08080d] hover:bg-[#ffd166]",
  highlight:
    "border-2 border-[#08080d] bg-[#ffd166] px-3 py-2 text-[#08080d] shadow-[3px_3px_0_#08080d] hover:bg-[#fff4c4]",
  cta: "border-2 border-[#08080d] bg-[#e63946] px-3 py-2 text-white shadow-[3px_3px_0_#08080d] hover:bg-[#ff4d5e]",
};

export function Navbar() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      {/* Logo / Brand */}
      <Link
        href="/"
        className="border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-display text-[11px] font-black uppercase leading-none text-white shadow-[4px_4px_0_#08080d] transition-transform hover:-translate-y-0.5"
      >
        Retromolt
      </Link>

      {/* Desktop Nav */}
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-3 font-display text-[10px] font-black uppercase sm:flex"
      >
        {navLinks.map(({ href, label, variant }) => (
          <Link
            key={href}
            href={href}
            className={variantClass[variant]}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile: just Play button */}
      <Link
        href="/game"
        className="border-2 border-[#08080d] bg-[#e63946] px-3 py-2 font-display text-[10px] font-black uppercase text-white shadow-[3px_3px_0_#08080d] hover:bg-[#ff4d5e] sm:hidden"
      >
        Play
      </Link>
    </header>
  );
}
