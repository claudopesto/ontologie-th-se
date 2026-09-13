'use client';

import { useState } from 'react';
import { AXES } from '@/lib/axes';

export default function ConceptSidebar({
  concepts,
  filteredConcepts,
  selectedConcept,
  onConceptClick,
  selectedAxe,
  onAxeChange,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const conceptsToDisplay = filteredConcepts || concepts;

  const displayedConcepts = conceptsToDisplay.filter((concept) =>
    concept.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-300">
      <div className="p-3 sm:p-4 border-b border-gray-300" style={{ backgroundColor: '#A2C2EB' }}>
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Concepts</h2>

        <input
          type="text"
          placeholder="Rechercher un concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-base"
        />

        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Axes de recherche</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAxeChange('all')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors border-2 ${
                selectedAxe === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-transparent hover:bg-gray-100'
              }`}
            >
              Tous
            </button>
            {AXES.map((axe) => (
              <button
                key={axe.id}
                onClick={() => onAxeChange(axe.id)}
                title={axe.label}
                className="px-3 py-1 text-xs rounded-full font-medium transition-colors border-2"
                style={
                  selectedAxe === axe.id
                    ? { backgroundColor: axe.color, borderColor: axe.color, color: '#fff' }
                    : { backgroundColor: '#fff', borderColor: axe.color, color: axe.color }
                }
              >
                {axe.shortLabel}
              </button>
            ))}
          </div>
          {selectedAxe !== 'all' && (
            <p className="text-xs text-white/90 italic mt-2 leading-snug">
              {AXES.find((a) => a.id === selectedAxe)?.label}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {displayedConcepts.map((concept, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  onConceptClick(concept);
                  setSearchQuery('');
                }}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedConcept?.label === concept.label
                    ? 'bg-blue-100 text-blue-900 font-semibold'
                    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                }`}
              >
                {concept.label}
              </button>
            </li>
          ))}
        </ul>
        {displayedConcepts.length === 0 && (
          <p className="text-gray-500 text-center mt-4">Aucun concept trouvé</p>
        )}
      </div>
    </div>
  );
}