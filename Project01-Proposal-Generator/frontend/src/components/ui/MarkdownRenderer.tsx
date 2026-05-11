'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm sm:prose max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-near-black)] mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-near-black)] mt-4 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base sm:text-lg font-semibold text-[var(--color-near-black)] mt-3 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-sm sm:text-base text-[var(--color-gray)] mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm sm:text-base text-[var(--color-gray)]">{children}</li>,
          table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="min-w-full border border-[rgba(14,15,12,0.12)] text-sm">{children}</table></div>,
          thead: ({ children }) => <thead className="bg-[rgba(14,15,12,0.05)]">{children}</thead>,
          th: ({ children }) => <th className="border border-[rgba(14,15,12,0.12)] px-3 py-2 text-left font-semibold text-[var(--color-near-black)]">{children}</th>,
          td: ({ children }) => <td className="border border-[rgba(14,15,12,0.12)] px-3 py-2 text-[var(--color-gray)]">{children}</td>,
          tr: ({ children }) => <tr className="border-b border-[rgba(14,15,12,0.12)]">{children}</tr>,
          strong: ({ children }) => <strong className="font-semibold text-[var(--color-near-black)]">{children}</strong>,
          em: ({ children }) => <em className="italic text-[var(--color-gray)]">{children}</em>,
          code: ({ children }) => <code className="bg-[rgba(14,15,12,0.08)] px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-[var(--color-near-black)]">{children}</code>,
          pre: ({ children }) => <pre className="bg-[rgba(14,15,12,0.08)] p-3 rounded overflow-x-auto mb-3 text-xs sm:text-sm font-mono">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-[var(--color-primary)] pl-3 italic text-[var(--color-gray)] mb-3">{children}</blockquote>,
          hr: () => <hr className="my-4 border-[rgba(14,15,12,0.12)]" />,
          a: ({ href, children }) => <a href={href} className="text-[var(--color-primary)] hover:underline">{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}