export default function ConceptDetail({ concept, onReturnToGraph, concepts = [], onConceptClick }) {
  if (!concept) {
    return (
      <div className="p-4 sm:p-6 bg-white border-t border-gray-300 h-full flex flex-col items-center justify-center">
        <img
          src="/dessinelsa.png"
          alt="Illustration recherche"
          className="max-w-xs sm:max-w-sm md:max-w-md w-full h-auto mb-6"
          loading="lazy"
        />
        <div className="text-center">
          <p className="text-gray-500 italic text-sm sm:text-base">
            Sélectionnez un concept pour voir sa définition
          </p>
          <p className="text-gray-400 text-xs mt-2 lg:hidden">
            Utilisez l&apos;onglet &quot;Graphique&quot; pour choisir un concept
          </p>
        </div>
      </div>
    );
  }

  const getHypothesis = () => {
    const hypotheses = [];

    const ciensTrimmed = concept.hypothese_ciens?.trim();
    if (ciensTrimmed) {
      hypotheses.push({
        type: 'CIENS',
        text: ciensTrimmed,
        label: 'Hypothèse de recherche',
      });
    }

    const theseTrimmed = concept.hypothese_these?.trim();
    if (theseTrimmed) {
      hypotheses.push({
        type: 'Thèse',
        text: theseTrimmed,
        label: 'Hypothèse de recherche',
      });
    }

    return hypotheses;
  };

  const getRelatedConcepts = () => {
    if (!concept.relations || !concept.relations.trim()) {
      return [];
    }

    const relatedLabels = concept.relations
      .split(';')
      .map((label) => label.trim())
      .filter((label) => label);

    const relatedConcepts = relatedLabels
      .map((label) => {
        let found = concepts.find((c) => c.label === label);

        if (!found) {
          found = concepts.find((c) => c.label.toLowerCase() === label.toLowerCase());
        }

        if (!found) {
          found = concepts.find(
            (c) =>
              c.label.toLowerCase().includes(label.toLowerCase()) ||
              label.toLowerCase().includes(c.label.toLowerCase())
          );
        }

        return found;
      })
      .filter((c) => c !== undefined);

    // Dédoublonne : plusieurs termes de "relations" peuvent avoir été
    // associés au même concept réel via la correspondance floue.
    const uniqueRelatedConcepts = relatedConcepts.filter(
      (c, index, self) => self.findIndex((other) => other.label === c.label) === index
    );

    return uniqueRelatedConcepts;
  };

  const hypothesis = getHypothesis();
  const relatedConcepts = getRelatedConcepts();

  return (
    <div className="p-4 sm:p-6 bg-white border-t border-gray-300 h-full overflow-y-auto">
      <div className="lg:hidden mb-4">
        <button
          onClick={onReturnToGraph}
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

      {hypothesis.length > 0 && (
        <div className="mb-6">
          {hypothesis.map((hyp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-purple-700 leading-tight">
                {hyp.label}
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 sm:p-4 rounded-r-md">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {hyp.text}
                </p>
              </div>
            </div>
          ))}
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

      {relatedConcepts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
            Concepts en relation
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((relatedConcept) => (
              <button
                key={relatedConcept.label}
                onClick={() => onConceptClick && onConceptClick(relatedConcept)}
                className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 border border-blue-300 hover:border-blue-400"
              >
                <span className="mr-1">🔗</span>
                {relatedConcept.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Cliquez sur un concept pour voir sa définition
          </p>
        </div>
      )}

      <div className="lg:hidden h-16"></div>
    </div>
  );
}