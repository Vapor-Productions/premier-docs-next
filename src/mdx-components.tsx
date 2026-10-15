import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import { FlowSteps } from "@/components/FlowSteps";
import { slugify } from "@/lib/slug";

function isInternal(href?: string) {
  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

function heading(Tag: "h2" | "h3") {
  return function Heading({ children }: { children?: ReactNode }) {
    const id = slugify(textOf(children));
    return (
      <Tag id={id}>
        {children}
        <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
          #
        </a>
      </Tag>
    );
  };
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FlowSteps,
    h2: heading("h2"),
    h3: heading("h3"),
    table: (props) => (
      <div className="table-wrap">
        <table {...props} />
      </div>
    ),
    a: ({ href, children, ...props }) =>
      isInternal(href) ? (
        <Link href={href!} {...props}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
        </a>
      ),
    ...components,
  };
}
