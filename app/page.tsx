'use client';

import { useEffect, useState } from 'react';
import { Concept } from '@/types/ontology';
import { fetchConceptsFromSheet } from '@/lib/googleSheets';
import OntologyGraph from '@/components/OntologyGraph';
import ConceptSidebar from '@/components/ConceptSidebar';
import ConceptDetail from '@/components/ConceptDetail';
import MobileHelp from '@/components/MobileHelp';

export default function Home() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mobile navigation state
  const [mobileActiveTab, setMobileActiveTab] = useState<'menu' | 'graph' | 'detail'>('graph');
  
  // Window resize state for desktop layout
  const [leftPanelWidth, setLeftPanelWidth] = useState(320); // w-80 = 320px
  const [rightPanelWidth, setRightPanelWidth] = useState(384); // w-96 = 384px
  const minPanelWidth = 200;
  const maxPanelWidth = 600;

  useEffect(() => {
    async function loadConcepts() {
      try {
        setLoading(true);
        const data = await fetchConceptsFromSheet();
        setConcepts(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Error loading concepts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadConcepts();
  }, []);

  // Auto switch to detail tab when concept is selected on mobile
  useEffect(() => {
    if (selectedConcept && window.innerWidth < 1024) {
      setMobileActiveTab('detail');
    }
  }, [selectedConcept]);

  // Panel resize functions
  const adjustLeftPanel = (direction: 'increase' | 'decrease') => {
    setLeftPanelWidth(prev => {
      const newWidth = direction === 'increase' ? prev + 50 : prev - 50;
      return Math.max(minPanelWidth, Math.min(maxPanelWidth, newWidth));
    });
  };

  const adjustRightPanel = (direction: 'increase' | 'decrease') => {
    setRightPanelWidth(prev => {
      const newWidth = direction === 'increase' ? prev + 50 : prev - 50;
      return Math.max(minPanelWidth, Math.min(maxPanelWidth, newWidth));
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-xl text-gray-600">Un instant, je cherche les recherches d&apos;Elsa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  // Filter concepts based on selected filter and category
  const filteredConcepts = concepts.filter(concept => {
    // Apply travaux filter first
    let passesTravauxFilter = false;
    if (selectedFilter === 'all') {
      passesTravauxFilter = true;
    } else if (selectedFilter === 'CIENS') {
      passesTravauxFilter = concept.travaux.includes('CIENS');
    } else if (selectedFilter === 'Thèse') {
      passesTravauxFilter = concept.travaux.includes('Thèse');
    } else {
      passesTravauxFilter = concept.travaux === selectedFilter;
    }

    // Apply category filter
    let passesCategoryFilter = false;
    if (selectedCategory === 'all') {
      passesCategoryFilter = true;
    } else {
      passesCategoryFilter = concept.categorie === selectedCategory;
    }

    return passesTravauxFilter && passesCategoryFilter;
  });

  return (
    <div className="flex flex-col bg-white min-h-screen lg:h-screen">
      {/* Header */}
      <header className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-md text-center" style={{ backgroundColor: '#7c81fd' }}>
        <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-white">Recherches universitaires d&apos;Elsa Novelli</h1>
      </header>

      {/* Mobile Navigation Tabs - Only visible on mobile */}
      <div className="lg:hidden border-b border-gray-300">
        <div className="flex">
          <button
            onClick={() => setMobileActiveTab('menu')}
            className={`flex-1 py-3 px-2 text-sm font-medium text-center transition-colors ${
              mobileActiveTab === 'menu' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Filtres & Concepts
          </button>
          <button
            onClick={() => setMobileActiveTab('graph')}
            className={`flex-1 py-3 px-2 text-sm font-medium text-center transition-colors ${
              mobileActiveTab === 'graph' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🕸️ Graphique
          </button>
          <button
            onClick={() => setMobileActiveTab('detail')}
            className={`flex-1 py-3 px-2 text-sm font-medium text-center transition-colors ${
              mobileActiveTab === 'detail' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📖 Définition
            {selectedConcept && <span className="ml-1 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex flex-1 overflow-hidden m-4 gap-4">
        {/* Left: Menu/Filters */}
        <div style={{ width: `${leftPanelWidth}px` }} className="h-full border border-gray-300 rounded-xl overflow-y-auto shadow-sm flex flex-col">
          <ConceptSidebar
            concepts={filteredConcepts}
            selectedConcept={selectedConcept}
            onConceptClick={setSelectedConcept}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          {/* Resize buttons for left panel */}
          <div className="flex gap-2 p-2 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => adjustLeftPanel('decrease')}
              title="Réduire la fenêtre"
              className="flex-1 px-2 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded transition-colors"
            >
              ➖
            </button>
            <button
              onClick={() => adjustLeftPanel('increase')}
              title="Augmenter la fenêtre"
              className="flex-1 px-2 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded transition-colors"
            >
              ➕
            </button>
          </div>
        </div>

        {/* Center: Graph Visualization */}
        <div className="flex-1 h-full border border-gray-300 rounded-xl overflow-hidden shadow-sm">
          <OntologyGraph
            concepts={concepts}
            onNodeClick={setSelectedConcept}
            selectedFilter={selectedFilter}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Right: Concept Definition */}
        <div style={{ width: `${rightPanelWidth}px` }} className="h-full overflow-y-auto border border-gray-300 rounded-xl shadow-sm flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ConceptDetail 
              concept={selectedConcept}
              onReturnToGraph={() => setMobileActiveTab('graph')}
              concepts={concepts}
              onConceptClick={setSelectedConcept}
            />
          </div>
          {/* Resize buttons for right panel */}
          <div className="flex gap-2 p-2 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => adjustRightPanel('decrease')}
              title="Réduire la fenêtre"
              className="flex-1 px-2 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded transition-colors"
            >
              ➖
            </button>
            <button
              onClick={() => adjustRightPanel('increase')}
              title="Augmenter la fenêtre"
              className="flex-1 px-2 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded transition-colors"
            >
              ➕
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Tabbed interface with full height sections */}
      <div className="lg:hidden flex-1 flex flex-col">
        {/* Menu Tab */}
        <div className={`${mobileActiveTab === 'menu' ? 'flex' : 'hidden'} flex-1 flex-col overflow-hidden`}>
          <div className="flex-1 overflow-y-auto">
            <ConceptSidebar
              concepts={filteredConcepts}
              selectedConcept={selectedConcept}
              onConceptClick={(concept) => {
                setSelectedConcept(concept);
                setMobileActiveTab('detail');
              }}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Graph Tab */}
        <div className={`${mobileActiveTab === 'graph' ? 'flex' : 'hidden'} flex-1 flex-col overflow-hidden`}>
          <div className="flex-1 min-h-0">
            <OntologyGraph
              concepts={concepts}
              onNodeClick={(concept) => {
                setSelectedConcept(concept);
                setMobileActiveTab('detail');
              }}
              selectedFilter={selectedFilter}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>

        {/* Detail Tab */}
        <div className={`${mobileActiveTab === 'detail' ? 'flex' : 'hidden'} flex-1 flex-col overflow-hidden`}>
          <div className="flex-1 overflow-y-auto">
            <ConceptDetail 
              concept={selectedConcept} 
              onReturnToGraph={() => setMobileActiveTab('graph')}
              concepts={concepts}
              onConceptClick={setSelectedConcept}
            />
          </div>
        </div>
      </div>

      {/* Mobile Help Component */}
      <MobileHelp />
    </div>
  );
}
