import { Concept } from '@/types/ontology';

interface ConceptDetailProps {
  concept: Concept | null;
}

export default function ConceptDetail({ concept }: ConceptDetailProps) {
  if (!concept) {
    return (
      <div className="p-4 sm:p-6 bg-white border-t border-gray-300 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-500 italic text-sm sm:text-base">
            Sélectionnez un concept pour voir sa définition
          </p>
          <p className="text-gray-400 text-xs mt-2 lg:hidden">
            Utilisez l'onglet "Graphique" pour choisir un concept
          </p>
        </div>
      </div>
    );
  }

  // Determine which hypothesis to show based on concept's travaux
  const getHypothesis = () => {
    if (concept.travaux.includes('Thèse') && concept.hypothese_these) {
      return concept.hypothese_these;
    } else if (concept.travaux.includes('CIENS') && concept.hypothese_ciens) {
      return concept.hypothese_ciens;
    }
    return null;
  };

  const hypothesis = getHypothesis();

  return (
    <div className="p-4 sm:p-6 bg-white border-t border-gray-300 h-full overflow-y-auto">
      {/* Mobile: Back to graph button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <span className="mr-1">←</span>
          Retour au graphique
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 leading-tight">
        {concept.label}
      </h2>

      {concept.definition && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Définition</h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {concept.definition}
          </p>
        </div>
      )}

      {hypothesis && (
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-purple-700 leading-tight">
            {concept.travaux.includes('Thèse') ? 
              'Hypothèse de recherche travaillée dans le cadre de la thèse' : 
              'Hypothèse de recherche travaillée dans le cadre du projet portant sur la guerre cognitive menée au CIENS'
            }
          </h3>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-3 sm:p-4 rounded-r-md">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {hypothesis}
            </p>
          </div>
        </div>
      )}

      {concept.auteur1 && (
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
            Auteur : {concept.auteur1}
          </h3>
          {concept.reference_auteur1 && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 italic leading-relaxed">
              {concept.reference_auteur1}
            </p>
          )}
          {concept.citation_auteur1 && (
            <blockquote className="border-l-4 border-blue-500 pl-3 sm:pl-4 italic text-gray-600 text-sm sm:text-base leading-relaxed">
              &ldquo;{concept.citation_auteur1}&rdquo;
            </blockquote>
          )}
        </div>
      )}

      {concept.auteur2 && (
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
            Auteur : {concept.auteur2}
          </h3>
          {concept.reference_auteur2 && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 italic leading-relaxed">
              {concept.reference_auteur2}
            </p>
          )}
          {concept.citation_auteur2 && (
            <blockquote className="border-l-4 border-blue-500 pl-3 sm:pl-4 italic text-gray-600 text-sm sm:text-base leading-relaxed">
              &ldquo;{concept.citation_auteur2}&rdquo;
            </blockquote>
          )}
        </div>
      )}

      {/* Mobile: Bottom spacing for better scrolling */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
}
