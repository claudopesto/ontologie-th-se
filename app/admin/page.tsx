'use client';

import { useState, useEffect, useCallback } from 'react';

interface Article {
  name: string;
  sha: string;
  path: string;
}

interface ArticleContent {
  filename: string;
  sha: string;
  content: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleContent | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [newFilename, setNewFilename] = useState('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        showMessage('Session expirée');
        return;
      }

      if (!response.ok) throw new Error('Erreur chargement');

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
      showMessage('Erreur lors du chargement des articles');
    }
    setIsLoading(false);
  }, [password]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        const data = await response.json();
        setArticles(data);
        // Sauvegarder le mot de passe dans sessionStorage
        sessionStorage.setItem('admin_password', password);
      } else {
        showMessage('Mot de passe incorrect');
      }
    } catch (error) {
      console.error(error);
      showMessage('Erreur de connexion');
    }
    setIsLoading(false);
  };

  const loadArticle = async (article: Article) => {
    setIsLoading(true);
    setIsNewArticle(false);
    try {
      const slug = article.name.replace('.mdx', '');
      const response = await fetch(`/api/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) throw new Error('Erreur chargement');

      const data = await response.json();
      setSelectedArticle(data);
      setContent(data.content);
    } catch (error) {
      console.error(error);
      showMessage('Erreur lors du chargement de l\'article');
    }
    setIsLoading(false);
  };

  const saveArticle = async () => {
    if (!content) return;

    setIsSaving(true);
    try {
      if (isNewArticle) {
        // Créer un nouvel article
        const filename = newFilename.endsWith('.mdx') ? newFilename : `${newFilename}.mdx`;
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${password}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename, content }),
        });

        if (!response.ok) throw new Error('Erreur création');

        showMessage('Article créé !');
        setIsNewArticle(false);
        setNewFilename('');
        fetchArticles();
      } else if (selectedArticle) {
        // Modifier un article existant
        const slug = selectedArticle.filename.replace('.mdx', '');
        const response = await fetch(`/api/articles/${slug}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${password}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, sha: selectedArticle.sha }),
        });

        if (!response.ok) throw new Error('Erreur sauvegarde');

        const result = await response.json();
        setSelectedArticle({ ...selectedArticle, sha: result.sha });
        showMessage('Sauvegardé !');
      }
    } catch (error) {
      console.error(error);
      showMessage('Erreur lors de la sauvegarde');
    }
    setIsSaving(false);
  };

  const deleteArticle = async () => {
    if (!selectedArticle) return;
    if (!confirm('Supprimer cet article ?')) return;

    setIsLoading(true);
    try {
      const slug = selectedArticle.filename.replace('.mdx', '');
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sha: selectedArticle.sha }),
      });

      if (!response.ok) throw new Error('Erreur suppression');

      showMessage('Article supprimé');
      setSelectedArticle(null);
      setContent('');
      fetchArticles();
    } catch (error) {
      console.error(error);
      showMessage('Erreur lors de la suppression');
    }
    setIsLoading(false);
  };

  const startNewArticle = () => {
    setIsNewArticle(true);
    setSelectedArticle(null);
    const today = new Date().toISOString().split('T')[0];
    setNewFilename(`${today}-nouvel-article`);
    setContent(`---
title: "Nouvel article"
date: "${today}"
excerpt: "Description de l'article"
concepts:
  - concept1
  - concept2
---

Commencez à écrire ici...
`);
  };

  // Vérifier si un mot de passe est stocké
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  // Écran de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-serif text-stone-800 mb-6 text-center">
            Administration
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Mot de passe"
            className="w-full p-3 border border-stone-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            autoFocus
          />
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Interface d'édition
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/blog" className="text-stone-600 hover:text-stone-900">
            ← Blog
          </a>
          <h1 className="text-lg font-serif text-stone-800">Éditeur</h1>
        </div>
        <div className="flex items-center gap-2">
          {message && (
            <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded">
              {message}
            </span>
          )}
          <button
            onClick={startNewArticle}
            className="bg-stone-100 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors text-sm"
          >
            + Nouveau
          </button>
          <button
            onClick={saveArticle}
            disabled={isSaving || (!selectedArticle && !isNewArticle)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm"
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Liste des articles (sidebar sur desktop, menu déroulant sur mobile) */}
        <aside className="bg-white border-b md:border-b-0 md:border-r border-stone-200 md:w-64 flex-shrink-0">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Articles
            </h2>
            {isLoading && !articles.length ? (
              <p className="text-stone-500 text-sm">Chargement...</p>
            ) : (
              <ul className="space-y-1 max-h-48 md:max-h-none overflow-y-auto">
                {articles.map((article) => (
                  <li key={article.name}>
                    <button
                      onClick={() => loadArticle(article)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedArticle?.filename === article.name
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {article.name.replace('.mdx', '')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Zone d'édition */}
        <main className="flex-1 flex flex-col p-4">
          {isNewArticle && (
            <div className="mb-4">
              <label className="block text-sm text-stone-600 mb-1">
                Nom du fichier
              </label>
              <input
                type="text"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="2026-02-04-mon-article"
              />
              <span className="text-stone-400 ml-2">.mdx</span>
            </div>
          )}

          {selectedArticle || isNewArticle ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">
                  {isNewArticle ? 'Nouvel article' : selectedArticle?.filename}
                </span>
                {selectedArticle && (
                  <button
                    onClick={deleteArticle}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none min-h-[400px]"
                placeholder="Écrivez votre article en MDX..."
                spellCheck={false}
              />
              <p className="mt-2 text-xs text-stone-500">
                Astuce : Utilisez le format YAML au début pour les métadonnées (title, date, excerpt, concepts)
              </p>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400">
              <div className="text-center">
                <p className="text-lg mb-2">Sélectionnez un article</p>
                <p className="text-sm">ou créez-en un nouveau</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
