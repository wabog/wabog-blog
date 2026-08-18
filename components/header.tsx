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
        <div className="container top-banner-container">
          <span className="top-banner-label">Habla con ventas:</span>
          <a
            href="https://wa.me/12058921790?text=Hola%2C%20estoy%20viendo%20el%20blog%20de%20Wabog%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            className="top-banner-link"
            data-analytics="topbar_ventas_whatsapp"
            data-analytics-location="top_banner"
          >
            <span className="top-banner-link-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.757.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.875 7.875 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="container">
        <nav className="navbar" aria-label="Principal">
          <Link href="/" className="navbar-brand" data-analytics="nav_logo">
            <img
              className="brand-logo-light"
              src="/wabog_name_logo_light.webp"
              alt="WABOG"
            />
            <img
              className="brand-logo-dark"
              src="/wabog_name_logo.webp"
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