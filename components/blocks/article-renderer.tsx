import type { ReactElement, ComponentType } from "react";
import type { BlogBlock } from "@/lib/types";
import { registry } from "@/lib/registry";
import { headingId } from "@/lib/reading-time";

export function ArticleRenderer({ blocks }: { blocks: BlogBlock[] }): ReactElement {
  return (
    <div className="article-prose">
      {blocks.map((block, index) => {
        const Component = registry[block.type] as ComponentType<BlogBlock>;
        const props =
          block.type === "heading"
            ? { ...block, id: block.id ?? headingId(block.text) }
            : block;
        return <Component key={index} {...props} />;
      })}
    </div>
  );
}