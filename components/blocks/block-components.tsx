import Image from "next/image";
import type { BlogBlock } from "@/lib/types";
import { headingId } from "@/lib/reading-time";
import { Faq } from "./faq";

function Paragraph({ text }: Extract<BlogBlock, { type: "paragraph" }>) {
  return <p>{text}</p>;
}

function Heading({
  level,
  id,
  text,
}: { level: 2 | 3 | 4; id?: string; text: string }) {
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  return <Tag id={id ?? headingId(text)}>{text}</Tag>;
}

function List({ ordered, items }: Extract<BlogBlock, { type: "list" }>) {
  return ordered ? <ol>{items.map((i, n) => <li key={n}>{i}</li>)}</ol> : <ul>{items.map((i, n) => <li key={n}>{i}</li>)}</ul>;
}

function Quote({ text, cite }: Extract<BlogBlock, { type: "quote" }>) {
  return (
    <blockquote>
      <p>{text}</p>
      {cite ? <footer>— {cite}</footer> : null}
    </blockquote>
  );
}

function ImageBlock({ src, alt, caption }: Extract<BlogBlock, { type: "image" }>) {
  return (
    <figure>
      <Image src={src} alt={alt} width={1600} height={900} className="article-image" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Embed({ url, title }: Extract<BlogBlock, { type: "embed" }>) {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = url;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="embed-card">
      <span className="embed-card-icon">↗</span>
      <span className="embed-card-body">
        <span className="embed-card-title">{title ?? host}</span>
        <span className="embed-card-url">{url}</span>
      </span>
    </a>
  );
}

function Code({ lang, code }: Extract<BlogBlock, { type: "code" }>) {
  return (
    <pre className="code-block">
      {lang ? <div className="code-block-header">{lang}</div> : null}
      <code>{code}</code>
    </pre>
  );
}

function Callout({ tone, title, text }: Extract<BlogBlock, { type: "callout" }>) {
  return (
    <aside className={`callout callout-${tone}`}>
      {title ? <div className="callout-title">{title}</div> : null}
      <p>{text}</p>
    </aside>
  );
}

function CtaPill({ label, href }: Extract<BlogBlock, { type: "cta_pill" }>) {
  return (
    <div className="cta-pill-center">
      <a href={href} rel="noopener noreferrer" className="cta-pill">
        {label}
      </a>
    </div>
  );
}

function Tldr({ text }: Extract<BlogBlock, { type: "tldr" }>) {
  return (
    <aside className="tldr">
      <span className="tldr-label">TL;DR</span>
      <p>{text}</p>
    </aside>
  );
}

function Table({ headers, rows }: Extract<BlogBlock, { type: "table" }>) {
  return (
    <div className="prose-table-wrap">
      <table className="prose-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Divider() {
  return <hr className="divider" />;
}

function Youtube({ videoId }: Extract<BlogBlock, { type: "youtube" }>) {
  return (
    <div className="youtube-wrap">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="Video de YouTube"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export const blockComponents = {
  paragraph: Paragraph,
  heading: Heading,
  list: List,
  quote: Quote,
  image: ImageBlock,
  embed: Embed,
  code: Code,
  callout: Callout,
  cta_pill: CtaPill,
  faq: Faq,
  tldr: Tldr,
  table: Table,
  divider: Divider,
  youtube: Youtube,
};

export { headingId };