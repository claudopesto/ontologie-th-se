import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'claudopesto/ontologie-th-se';
const ARTICLES_PATH = 'content/articles';

// Vérifier le mot de passe admin
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === process.env.ADMIN_PASSWORD;
}

// GET - Liste tous les articles
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${ARTICLES_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Erreur GitHub API');
    }

    const files = await response.json();
    const articles = files
      .filter((f: { name: string }) => f.name.endsWith('.mdx'))
      .map((f: { name: string; sha: string; path: string }) => ({
        name: f.name,
        sha: f.sha,
        path: f.path,
      }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Erreur liste articles:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un nouvel article
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return NextResponse.json({ error: 'Filename et content requis' }, { status: 400 });
    }

    const path = `${ARTICLES_PATH}/${filename}`;
    const encodedContent = Buffer.from(content).toString('base64');

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Nouvel article: ${filename}`,
          content: encodedContent,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur création');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur création article:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
