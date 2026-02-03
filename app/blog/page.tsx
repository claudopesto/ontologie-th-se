import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export const metadata = {
  title: 'Blog | Ontologie',
  description: 'Articles et réflexions sur les concepts de la thèse',
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
          >
            ← Retour à l'ontologie
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-gray-900 mb-4">
          Blog
        </h1>
        <p className="text-gray-600 text-lg mb-16 leading-relaxed">
          Notes éparses en mode échec.
        </p>

        {/* Articles list */}
        <div className="space-y-12">
          {articles.length === 0 ? (
            <p className="text-gray-500 italic">Aucun article pour le moment.</p>
          ) : (
            articles.map((article) => (
              <article key={article.slug} className="group">
                <Link href={`/blog/${article.slug}`}>
                  <div className="space-y-3">
                    {/* Date and reading time */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <time dateTime={article.frontmatter.date}>
                        {new Date(article.frontmatter.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span>·</span>
                      <span>{article.readingTime}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-2xl md:text-3xl text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {article.frontmatter.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-gray-600 leading-relaxed">
                      {article.frontmatter.summary}
                    </p>

                    {/* Concepts tags */}
                    {article.frontmatter.concepts && article.frontmatter.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {article.frontmatter.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} · Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}
