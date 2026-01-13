'use client';

import { useEffect, useState } from 'react';
import { Concept } from '@/types/ontology';
import { fetchConceptsFromSheet } from '@/lib/googleSheets';
import OntologyGraph from '@/components/OntologyGraph';
import ConceptSidebar from '@/components/ConceptSidebar';
import ConceptDetail from '@/components/ConceptDetail';

export default function Home() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    async function loadConcepts() {
      try {
        setLoading(true);
        const data = await fetchConceptsFromSheet();
        setConcepts(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadConcepts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-xl text-gray-600">Chargement des données...</p>
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

  // Filter concepts based on selected filter
  const filteredConcepts = concepts.filter(concept => {
    if (selectedFilter === 'all') return true;

    // For CIENS filter, include concepts with "CIENS" or "Thèse + CIENS"
    if (selectedFilter === 'CIENS') {
      return concept.travaux.includes('CIENS');
    }

    // For Thèse filter, include concepts with "Thèse" or "Thèse + CIENS"
    if (selectedFilter === 'Thèse') {
      return concept.travaux.includes('Thèse');
    }

    return concept.travaux === selectedFilter;
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-4 md:px-6 py-3 md:py-4 shadow-md text-center" style={{ backgroundColor: '#7c81fd' }}>
        <h1 className="text-lg md:text-2xl font-bold text-white">Recherches universitaires d&apos;Elsa Novelli</h1>
      </header>

      {/* Main Content Area - Responsive Layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden m-2 md:m-4 gap-2 md:gap-4">
        {/* Top/Left: Menu/Filters */}
        <div className="w-full lg:w-80 h-auto lg:h-full border border-gray-300 rounded-xl overflow-y-auto shadow-sm">
          <ConceptSidebar
            concepts={filteredConcepts}
            selectedConcept={selectedConcept}
            onConceptClick={setSelectedConcept}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {/* Center: Graph Visualization */}
        <div className="flex-1 h-[50vh] lg:h-full border border-gray-300 rounded-xl overflow-hidden shadow-sm">
          <OntologyGraph
            concepts={concepts}
            onNodeClick={setSelectedConcept}
            selectedFilter={selectedFilter}
          />
        </div>

        {/* Right/Bottom: Concept Definition */}
        <div className="w-full lg:w-96 h-auto lg:h-full overflow-y-auto border border-gray-300 rounded-xl shadow-sm">
          <ConceptDetail concept={selectedConcept} />
        </div>
      </div>
    </div>
  );
}
