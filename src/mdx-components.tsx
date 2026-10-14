import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { FlowSteps } from "@/components/FlowSteps";

function isInternal(href?: string) {
  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FlowSteps,
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
