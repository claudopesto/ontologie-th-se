'use client';

import { useState } from 'react';
import { Concept } from '@/types/ontology';
import { splitMultipleValues } from '@/lib/googleSheets';

interface ConceptSidebarProps {
  concepts: Concept[]; // All concepts for category extraction
  filteredConcepts?: Concept[]; // Filtered concepts for display (optional)
  selectedConcept: Concept | null;
  onConceptClick: (concept: Concept) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ConceptSidebar({
  concepts,
  filteredConcepts,
  selectedConcept,
  onConceptClick,
  selectedFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange
}: ConceptSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Use filteredConcepts for display if provided, otherwise use all concepts
  const conceptsToDisplay = filteredConcepts || concepts;

  // Get unique categories for filter buttons, sorted alphabetically
  // Support multiple categories separated by comma or semicolon
  // Normalize to lowercase for deduplication and filter out empty values
  const allCategoryValues = concepts
    .filter(concept => concept.categorie && concept.categorie.trim()) // Filter concepts with empty categories
    .flatMap(concept => 
      splitMultipleValues(concept.categorie)
        .map(cat => cat.toLowerCase().trim())
        .filter(cat => cat && cat.length > 0) // Double-check for empty values
    );
  
  // Remove exact duplicates and sort alphabetically
  const categories = Array.from(new Set(allCategoryValues))
    .filter(cat => cat && cat.length > 0) // Extra safety filter
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

  // Filter concepts by search query
  const displayedConcepts = conceptsToDisplay.filter(concept =>
    concept.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-300">
      <div className="p-3 sm:p-4 border-b border-gray-300" style={{ backgroundColor: '#7c81fd' }}>
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Concepts</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Rechercher un concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-base"
        />

        {/* Filter Buttons - Travaux */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white mb-2">Travaux</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'Thèse', label: 'Thèse' },
              { value: 'CIENS', label: 'CIENS' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  selectedFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Dropdown - Catégories */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Catégories</h3>
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-left flex justify-between items-center"
              >
                <span>{selectedCategory === 'all' ? 'Toutes les catégories' : selectedCategory}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      onCategoryChange('all');
                      // Keep dropdown open
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'
                    }`}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        // Keep dropdown open
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                        selectedCategory === category ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Concepts List */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {displayedConcepts.map((concept, index) => (
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
        {displayedConcepts.length === 0 && (
          <p className="text-gray-500 text-center mt-4">Aucun concept trouvé</p>
        )}
      </div>
    </div>
  );
}
