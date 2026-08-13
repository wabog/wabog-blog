"use client";

import { useState } from "react";
import type { BlogBlock } from "@/lib/types";

export function Faq({ items }: Extract<BlogBlock, { type: "faq" }>) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-block">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div className="faq-item" data-open={isOpen} key={index}>
            <button
              type="button"
              className="faq-button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <span className="faq-icon" aria-hidden="true">+</span>
            </button>
            {isOpen ? <div className="faq-answer">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}