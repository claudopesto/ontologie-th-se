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

// GET - Lire un article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const filename = `${slug}.mdx`;
    const path = `${ARTICLES_PATH}/${filename}`;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return NextResponse.json({
      filename: data.name,
      sha: data.sha,
      content,
    });
  } catch (error) {
    console.error('Erreur lecture article:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Modifier un article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const { content, sha } = await request.json();

    if (!content || !sha) {
      return NextResponse.json({ error: 'Content et SHA requis' }, { status: 400 });
    }

    const filename = `${slug}.mdx`;
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
          message: `Modification: ${filename}`,
          content: encodedContent,
          sha: sha,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur modification');
    }

    const result = await response.json();
    return NextResponse.json({ success: true, sha: result.content.sha });
  } catch (error) {
    console.error('Erreur modification article:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const { sha } = await request.json();

    if (!sha) {
      return NextResponse.json({ error: 'SHA requis' }, { status: 400 });
    }

    const filename = `${slug}.mdx`;
    const path = `${ARTICLES_PATH}/${filename}`;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Suppression: ${filename}`,
          sha: sha,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub DELETE error:', error);
      return NextResponse.json({ error: error.message || 'Erreur GitHub' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression article:', error);
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
