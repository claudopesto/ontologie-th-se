import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleFrontmatter {
  title: string;
  date: string;
  summary: string;
  concepts?: string[];
  author?: string;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: string;
}

export interface ArticlePreview {
  slug: string;
  frontmatter: ArticleFrontmatter;
  readingTime: string;
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((name) => name.replace(/\.mdx?$/, ''));
}

export function getArticleBySlug(slug: string): Article | null {
  const mdxPath = path.join(articlesDirectory, `${slug}.mdx`);
  const mdPath = path.join(articlesDirectory, `${slug}.md`);
  
  let fullPath = '';
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    content,
    readingTime: stats.text.replace('read', 'de lecture'),
  };
}

export function getAllArticles(): ArticlePreview[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      if (!article) return null;
      return {
        slug: article.slug,
        frontmatter: article.frontmatter,
        readingTime: article.readingTime,
      };
    })
    .filter((article): article is ArticlePreview => article !== null)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  return articles;
}

export function getArticlesByConceptLabel(conceptLabel: string): ArticlePreview[] {
  const allArticles = getAllArticles();
  return allArticles.filter((article) =>
    article.frontmatter.concepts?.some(
      (c) => c.toLowerCase() === conceptLabel.toLowerCase()
    )
  );
}
