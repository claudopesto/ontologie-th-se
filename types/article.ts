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
