import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { MDXComponents } from '@/components/mdx/MDXComponents';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return { title: 'Article non trouvé' };
  }

  return {
    title: `${article.frontmatter.title} | Pensées en vrac`,
    description: article.frontmatter.summary,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content, readingTime } = article;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link 
            href="/blog" 
            className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
          >
            ← Retour au blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 py-16">
        {/* Article header */}
        <header className="mb-12">
          {/* Date and reading time */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <time dateTime={frontmatter.date}>
              {new Date(frontmatter.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{readingTime}</span>
            {frontmatter.author && (
              <>
                <span>·</span>
                <span>{frontmatter.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-gray-900 leading-tight mb-6">
            {frontmatter.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-gray-600 leading-relaxed">
            {frontmatter.summary}
          </p>

          {/* Concepts tags */}
          {frontmatter.concepts && frontmatter.concepts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {frontmatter.concepts.map((concept) => (
                <Link
                  key={concept}
                  href={`/?concept=${encodeURIComponent(concept)}`}
                  className="text-sm px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                >
                  {concept}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Article content */}
        <div className="prose prose-lg prose-gray max-w-none
          prose-headings:font-serif prose-headings:font-normal
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:leading-relaxed prose-p:text-gray-700
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
          prose-strong:text-gray-900
          prose-em:text-gray-700
          prose-ul:text-gray-700
          prose-ol:text-gray-700
          prose-li:marker:text-gray-400
          prose-hr:border-gray-200 prose-hr:my-12
        ">
          <MDXRemote 
            source={content} 
            components={MDXComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
              },
            }}
          />
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-2xl mx-auto px-6 py-8 flex justify-between items-center">
          <Link 
            href="/blog" 
            className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
          >
            ← Tous les articles
          </Link>
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
          >
            Explorer l'ontologie →
          </Link>
        </div>
      </footer>
    </div>
  );
}
