import React from "react";
import { Link } from "react-router-dom";
import {
  FiZap, FiTrendingUp,
  FiMail, FiTwitter, FiInstagram, FiFacebook, FiGithub,
  FiMapPin, FiPhone, FiArrowRight,
} from "react-icons/fi";

const LINKS = {
  shop: [
    { label: "All Products", to: "/" },
    { label: "My Cart", to: "/cart" },
    { label: "My Orders", to: "/my-orders" },
    { label: "Checkout", to: "/checkout" },
  ],
  company: [
    { label: "About Us", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Press", to: "#" },
    { label: "Blog", to: "#" },
  ],
  support: [
    { label: "Help Centre", to: "#" },
    { label: "Returns", to: "#" },
    { label: "Shipping Info", to: "#" },
    { label: "Track Order", to: "/my-orders" },
  ],
};

const SOCIALS = [
  { Icon: FiTwitter, href: "#", label: "Twitter" },
  { Icon: FiInstagram, href: "#", label: "Instagram" },
  { Icon: FiFacebook, href: "#", label: "Facebook" },
  { Icon: FiGithub, href: "#", label: "GitHub" },
];

function FooterLinkGroup({ title, links }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {title}
      </h3>
      {links.map(({ label, to }) => (
        <Link
          key={label}
          to={to}
          className="footer-link group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-300 transition-colors duration-200"
        >
          <FiArrowRight
            size={12}
            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          />
          {label}
        </Link>
      ))}
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-20 border-t border-white/[0.06] bg-[rgba(10,11,15,0.92)] backdrop-blur-sm overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-sky-700/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-amber-600/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 pt-16 pb-8 sm:px-6">
        {/* ── TOP ROW ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12">

          {/* Brand + newsletter */}
          <div className="flex flex-col gap-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent w-fit"
            >
              <FiZap size={22} className="text-amber-400 flex-shrink-0" />
              AccessoryHub
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-[280px]">
              Your one-stop multi-vendor marketplace for premium accessories.
              Curated collections. Seamless delivery. Trusted vendors.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <FiMapPin size={14} className="text-amber-400 flex-shrink-0" />
                123 Market Street, Dhaka, Bangladesh
              </span>
              <span className="inline-flex items-center gap-2">
                <FiPhone size={14} className="text-amber-400 flex-shrink-0" />
                +880 1700-000000
              </span>
              <span className="inline-flex items-center gap-2">
                <FiMail size={14} className="text-amber-400 flex-shrink-0" />
                support@accessoryhub.io
              </span>
            </div>

            {/* Newsletter */}
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Stay in the loop
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 transition focus:border-amber-500/60 focus:bg-amber-500/5 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:from-amber-400 hover:to-amber-500"
                >
                  <FiMail size={14} /> Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          <FooterLinkGroup title="Shop" links={LINKS.shop} />
          <FooterLinkGroup title="Company" links={LINKS.company} />
          <FooterLinkGroup title="Support" links={LINKS.support} />
        </div>

        {/* ── DIVIDER ── */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          {/* Copyright */}
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {year}{" "}
            <span className="font-semibold text-slate-400">AccessoryHub</span>.
            All rights reserved.
          </p>

          {/* Vendor CTA pill */}
          <Link
            to="/vendor"
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-400/5 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-400/10 hover:border-sky-400/40 transition"
          >
            <FiTrendingUp size={13} />
            Sell on AccessoryHub
          </Link>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/10 transition"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* ── LEGAL BAR ── */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"].map((item) => (
            <span
              key={item}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
