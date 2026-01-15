'use client';

import { useState } from 'react';
import { Concept } from '@/types/ontology';

interface ConceptSidebarProps {
  concepts: Concept[];
  selectedConcept: Concept | null;
  onConceptClick: (concept: Concept) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ConceptSidebar({
  concepts,
  selectedConcept,
  onConceptClick,
  selectedFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange
}: ConceptSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories for filter buttons
  const categories = Array.from(new Set(concepts.map(concept => concept.categorie).filter(cat => cat.trim())));

  // Filter concepts by search query
  const filteredConcepts = concepts.filter(concept =>
    concept.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-300">
      <div className="p-4 border-b border-gray-300" style={{ backgroundColor: '#7c81fd' }}>
        <h2 className="text-xl font-bold mb-3 text-white">Concepts</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Rechercher un concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        {/* Filter Options - Travaux */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white mb-2">Travaux</h3>
          <div className="space-y-1">
            {[
              { value: 'all', label: 'Tous les travaux' },
              { value: 'Thèse', label: 'Thèse' },
              { value: 'CIENS', label: 'CIENS' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="travaux-filter"
                  value={option.value}
                  checked={selectedFilter === option.value}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Options - Catégories */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Catégories</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category-filter"
                  value="all"
                  checked={selectedCategory === 'all'}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-white">Toutes les catégories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category-filter"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Concepts List */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {filteredConcepts.map((concept, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  onConceptClick(concept);
                  setSearchQuery(''); // Clear search after clicking a concept
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
        {filteredConcepts.length === 0 && (
          <p className="text-gray-500 text-center mt-4">Aucun concept trouvé</p>
        )}
      </div>
    </div>
  );
}
