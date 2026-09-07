"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { captureAttribution, decorateOutboundLinks } from "@/lib/attribution";

/**
 * Conserva la campaña de origen cuando alguien llega al blog desde una campaña
 * y luego salta a wabog.com o app.wabog.com. Sin esto el salto se ve como una
 * visita de referencia y el registro se cuenta como directo.
 *
 * Se vuelve a ejecutar en cada navegación porque el router del App Router
 * reemplaza el contenido sin recargar la página, y los enlaces del post nuevo
 * llegan sin decorar.
 */
export function Attribution() {
  const pathname = usePathname();

  useEffect(() => {
    decorateOutboundLinks(captureAttribution());
  }, [pathname]);

  return null;
}
