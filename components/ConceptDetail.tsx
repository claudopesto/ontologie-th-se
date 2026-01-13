import { Concept } from '@/types/ontology';

interface ConceptDetailProps {
  concept: Concept | null;
}

export default function ConceptDetail({ concept }: ConceptDetailProps) {
  if (!concept) {
    return (
      <div className="p-6 bg-white border-t border-gray-300">
        <p className="text-gray-500 italic">Sélectionnez un concept pour voir sa définition</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-t border-gray-300 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{concept.label}</h2>

      {concept.definition && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Définition</h3>
          <p className="text-gray-700 leading-relaxed">{concept.definition}</p>
        </div>
      )}

      {concept.auteur1 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Auteur : {concept.auteur1}</h3>
          {concept.reference_auteur1 && (
            <p className="text-sm text-gray-600 mb-2 italic">{concept.reference_auteur1}</p>
          )}
          {concept.citation_auteur1 && (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
              &ldquo;{concept.citation_auteur1}&rdquo;
            </blockquote>
          )}
        </div>
      )}

      {concept.auteur2 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Auteur : {concept.auteur2}</h3>
          {concept.reference_auteur2 && (
            <p className="text-sm text-gray-600 mb-2 italic">{concept.reference_auteur2}</p>
          )}
          {concept.citation_auteur2 && (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
              &ldquo;{concept.citation_auteur2}&rdquo;
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}
