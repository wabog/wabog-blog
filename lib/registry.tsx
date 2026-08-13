import type { ComponentType } from "react";
import type { BlogBlock } from "./types";
import { blockComponents } from "@/components/blocks/block-components";

type BlocksMap = {
  [K in BlogBlock["type"]]: ComponentType<Extract<BlogBlock, { type: K }>>;
};

export const registry: BlocksMap = {
  paragraph: blockComponents.paragraph,
  heading: blockComponents.heading as BlocksMap["heading"],
  list: blockComponents.list,
  quote: blockComponents.quote,
  image: blockComponents.image,
  embed: blockComponents.embed,
  code: blockComponents.code,
  callout: blockComponents.callout,
  cta_pill: blockComponents.cta_pill,
  faq: blockComponents.faq,
  tldr: blockComponents.tldr,
  table: blockComponents.table,
  divider: blockComponents.divider,
  youtube: blockComponents.youtube,
};