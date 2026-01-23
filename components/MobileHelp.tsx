'use client';

import { useState } from 'react';

export default function MobileHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 pointer-events-auto"
        aria-label="Aide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Guide d'utilisation</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📋 Onglet Filtres & Concepts</h4>
                <p className="text-gray-600">
                  • Recherchez des concepts par nom<br/>
                  • Filtrez par travaux (Thèse/CIENS)<br/>
                  • Sélectionnez des catégories<br/>
                  • Touchez un concept pour voir sa définition
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🕸️ Onglet Graphique</h4>
                <p className="text-gray-600">
                  • Visualisation interactive des relations<br/>
                  • Touchez un nœud pour le sélectionner<br/>
                  • Pincez pour zoomer, glissez pour naviguer<br/>
                  • Les liens montrent les relations entre concepts
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📖 Onglet Définition</h4>
                <p className="text-gray-600">
                  • Détails complets du concept sélectionné<br/>
                  • Définitions et hypothèses de recherche<br/>
                  • Citations d'auteurs et références<br/>
                  • Défilement vertical pour lire tout le contenu
                </p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">💡 Astuce</h4>
                <p className="text-blue-700 text-xs">
                  Naviguez entre les onglets en touchant les boutons en haut. 
                  Un point bleu indique qu'un concept est sélectionné dans l'onglet Définition.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}