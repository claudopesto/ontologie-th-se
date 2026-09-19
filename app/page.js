'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchConceptsFromSheet } from '@/lib/googleSheets';
import OntologyGraph from '@/components/OntologyGraph';
import ConceptSidebar from '@/components/ConceptSidebar';
import ConceptDetail from '@/components/ConceptDetail';
import MobileHelp from '@/components/MobileHelp';
import AxeSummary from '@/components/AxeSummary';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-xl text-gray-600">Chargement...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAxe, setSelectedAxe] = useState('all');

  const [mobileActiveTab, setMobileActiveTab] = useState('graph');
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(384);
  const minPanelWidth = 200;
  const maxPanelWidth = 600;

  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (concepts.length > 0) {
      const conceptParam = searchParams.get('concept');
      if (conceptParam) {
        const foundConcept = concepts.find(
          (c) => c.label.toLowerCase() === conceptParam.toLowerCase()
        );
        if (foundConcept) {
          setSelectedConcept(foundConcept);
        }
      }
    }
  }, [concepts, searchParams]);

  useEffect(() => {
    if (selectedConcept && window.innerWidth < 1024) {
      setMobileActiveTab('detail');
    }
  }, [selectedConcept]);

  const handleLeftPanelMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const handleMouseMove = (ev) => {
      const delta = ev.clientX - startX;
      const newWidth = Math.max(minPanelWidth, Math.min(maxPanelWidth, startWidth + delta));
      setLeftPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRightPanelMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const handleMouseMove = (ev) => {
      const delta = startX - ev.clientX;
      const newWidth = Math.max(minPanelWidth, Math.min(maxPanelWidth, startWidth + delta));
      setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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

  const filteredConcepts = concepts.filter((concept) => {
    if (selectedAxe === 'all') return true;
    return concept.axe === selectedAxe;
  });

  return (
    <div className="flex flex-col bg-white min-h-screen lg:h-screen">
     <header className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-md flex items-center justify-between" style={{ backgroundColor: '#241454' }}>
  <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-white">Recherches universitaires d&apos;Elsa Novelli</h1>
  <Link
    href="/blog"
    className="text-white hover:text-blue-100 text-sm sm:text-base font-medium transition-colors"
  >
    Pensées en vrac →
  </Link>
</header>

      <div className="sm:hidden border-b border-gray-300">
        <div className="flex">
          <button
            onClick={() => setMobileActiveTab('menu')}
            className={`flex-1 py-3 px-2 text-sm font-medium text-center transition-colors ${
              mobileActiveTab === 'menu'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Filtres &amp; Concepts
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

      <div className="hidden sm:flex flex-1 overflow-hidden m-4 gap-4">
        <div style={{ width: `${leftPanelWidth}px` }} className="h-full border border-gray-300 rounded-xl overflow-y-auto shadow-sm relative">
          <ConceptSidebar
            concepts={concepts}
            filteredConcepts={filteredConcepts}
            selectedConcept={selectedConcept}
            onConceptClick={setSelectedConcept}
            selectedAxe={selectedAxe}
            onAxeChange={setSelectedAxe}
          />
          <div
            onMouseDown={handleLeftPanelMouseDown}
            className="absolute right-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
            title="Glissez pour redimensionner"
          />
        </div>

        <div className="flex-1 h-full border border-gray-300 rounded-xl overflow-hidden shadow-sm min-h-0 relative">
          <AxeSummary selectedAxe={selectedAxe} />
          <OntologyGraph
            concepts={concepts}
            onNodeClick={setSelectedConcept}
            selectedAxe={selectedAxe}
            selectedConceptLabel={selectedConcept?.label}
          />
          <button
            onClick={() => setIsGraphFullscreen(true)}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-all hover:scale-105 z-10"
            title="Agrandir le graphe"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        </div>

        <div style={{ width: `${rightPanelWidth}px` }} className="h-full overflow-y-auto border border-gray-300 rounded-xl shadow-sm relative">
          <ConceptDetail
            concept={selectedConcept}
            onReturnToGraph={() => setMobileActiveTab('graph')}
            concepts={concepts}
            onConceptClick={setSelectedConcept}
          />
          <div
            onMouseDown={handleRightPanelMouseDown}
            className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
            title="Glissez pour redimensionner"
          />
        </div>
      </div>

      <div className="sm:hidden flex-1 flex flex-col overflow-hidden">
        <div className={`${mobileActiveTab === 'menu' ? 'flex' : 'hidden'} flex-1 flex-col overflow-hidden`}>
          <div className="flex-1 overflow-y-auto">
            <ConceptSidebar
              concepts={concepts}
              filteredConcepts={filteredConcepts}
              selectedConcept={selectedConcept}
              onConceptClick={(concept) => {
                setSelectedConcept(concept);
                setMobileActiveTab('detail');
              }}
              selectedAxe={selectedAxe}
              onAxeChange={setSelectedAxe}
            />
          </div>
        </div>

        <div
          className={`${mobileActiveTab === 'graph' ? 'block' : 'hidden'} relative`}
          style={{ height: 'calc(100vh - 120px)' }}
        >
          <AxeSummary selectedAxe={selectedAxe} />
          <OntologyGraph
            concepts={concepts}
            onNodeClick={(concept) => {
              setSelectedConcept(concept);
              setMobileActiveTab('detail');
            }}
            selectedAxe={selectedAxe}
            selectedConceptLabel={selectedConcept?.label}
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.95))'
          }}></div>
        </div>

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

      {isGraphFullscreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Graphe de l&apos;ontologie</h2>
            <button
              onClick={() => setIsGraphFullscreen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className={`${selectedConcept ? 'w-2/3' : 'w-full'} h-full transition-all duration-300 relative`}>
              <AxeSummary selectedAxe={selectedAxe} />
              <OntologyGraph
                concepts={concepts}
                onNodeClick={setSelectedConcept}
                selectedAxe={selectedAxe}
                selectedConceptLabel={selectedConcept?.label}
              />
            </div>

            {selectedConcept && (
              <div className="w-1/3 h-full border-l border-gray-200 overflow-y-auto bg-white">
                <ConceptDetail
                  concept={selectedConcept}
                  onReturnToGraph={() => setSelectedConcept(null)}
                  concepts={concepts}
                  onConceptClick={setSelectedConcept}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <MobileHelp />
    </div>
  );
}