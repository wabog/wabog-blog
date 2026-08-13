/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();
  const homeActive = pathname === "/" || pathname === "/post";

  return (
    <header className="site-header">
      <div className="top-banner">
        <div className="top-banner-inner">
          <span className="top-banner-label">Habla con ventas:</span>
          <a
            href="https://wa.me/12058921790?text=Hola%2C%20estoy%20viendo%20el%20blog%20de%20Wabog%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="topbar_ventas_whatsapp"
            data-analytics-location="top_banner"
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="container">
        <nav className="navbar" aria-label="Principal">
          <Link href="/" className="navbar-brand" data-analytics="nav_logo">
            <img
              className="brand-logo-dark"
              src="/wabog_name_logo.webp"
              alt="WABOG"
            />
            <img
              className="brand-logo-light"
              src="/wabog_name_logo_light.webp"
              alt="WABOG"
            />
          </Link>

          <div className="navbar-links">
            <Link href="/" className={homeActive ? "is-active" : ""} data-analytics="nav_blog">
              Blog
            </Link>
            <a
              href="https://wabog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="off-site-link"
              data-analytics="nav_volver_sitio"
            >
              Volver a wabog.com
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="navbar-right">
            <ThemeToggle />
            <a
              href="https://wabog.com"
              className="btn btn-accent"
              data-analytics="nav_empieza_gratis"
            >
              Empieza gratis
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}