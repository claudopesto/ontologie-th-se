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
    return concept.travaux === selectedFilter;
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 shadow-md text-center" style={{ backgroundColor: '#7c81fd' }}>
        <h1 className="text-2xl font-bold text-white">Travaux de thèse d&apos;Elsa Novelli</h1>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Graph Visualization */}
        <div className="flex-1 border-r border-gray-300">
          <OntologyGraph
            concepts={filteredConcepts}
            onNodeClick={setSelectedConcept}
          />
        </div>

        {/* Right: Concept List Sidebar */}
        <div className="w-80">
          <ConceptSidebar
            concepts={filteredConcepts}
            selectedConcept={selectedConcept}
            onConceptClick={setSelectedConcept}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Bottom: Concept Definition */}
      <div className="h-64 overflow-y-auto border-t border-gray-300">
        <ConceptDetail concept={selectedConcept} />
      </div>
    </div>
  );
}
