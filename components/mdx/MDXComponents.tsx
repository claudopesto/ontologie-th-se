import React from 'react';
import Link from 'next/link';

// Footnote reference (the superscript number in the text)
function FootnoteRef({ id }: { id: string }) {
  return (
    <sup>
      <a 
        href={`#fn-${id}`} 
        id={`fnref-${id}`}
        className="text-purple-600 hover:text-purple-800 no-underline font-normal"
      >
        [{id}]
      </a>
    </sup>
  );
}

// Footnote content (at the bottom of the article)
function Footnote({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={`fn-${id}`} className="text-sm text-gray-600 flex gap-2">
      <a 
        href={`#fnref-${id}`} 
        className="text-purple-600 hover:text-purple-800 no-underline shrink-0"
      >
        [{id}]
      </a>
      <span>{children}</span>
    </div>
  );
}

// Concept link - links to the ontology graph
function ConceptLink({ children, concept }: { children: React.ReactNode; concept?: string }) {
  const conceptName = concept || (typeof children === 'string' ? children : '');
  return (
    <Link
      href={`/?concept=${encodeURIComponent(conceptName)}`}
      className="text-purple-700 bg-purple-50 px-1 rounded hover:bg-purple-100 transition-colors no-underline"
    >
      {children}
    </Link>
  );
}

// Callout/highlight box
function Callout({ children, type = 'note' }: { children: React.ReactNode; type?: 'note' | 'warning' | 'important' }) {
  const styles = {
    note: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    important: 'bg-purple-50 border-purple-500 text-purple-900',
  };

  return (
    <div className={`border-l-4 p-4 my-6 rounded-r ${styles[type]}`}>
      {children}
    </div>
  );
}

// Custom components for MDX
export const MDXComponents = {
  // Override default elements
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Handle footnote links
    if (href?.startsWith('#fn-') || href?.startsWith('#fnref-')) {
      return (
        <a href={href} className="text-purple-600 hover:text-purple-800 no-underline" {...props}>
          {children}
        </a>
      );
    }
    // External links
    if (href?.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" {...props}>
          {children}
        </a>
      );
    }
    // Internal links
    return (
      <Link href={href || '#'} className="text-blue-600 hover:underline" {...props}>
        {children}
      </Link>
    );
  },
  
  // Custom components
  FootnoteRef,
  Footnote,
  ConceptLink,
  Callout,
  
  // Enhanced blockquote
  blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      className="border-l-4 border-purple-500 bg-purple-50 py-2 px-4 my-6 rounded-r text-gray-700 not-italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code blocks
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre 
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"
      {...props}
    >
      {children}
    </pre>
  ),

  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // Inline code vs code block
    if (!className) {
      return (
        <code 
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <code className={className} {...props}>{children}</code>;
  },
};
