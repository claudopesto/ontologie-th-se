export const AXES = [
  {
    id: 'axe1',
    shortLabel: 'Axe 01',
    label: "Les effets des plateformes numériques sur l'individu",
    description: "Comment le design de plateforme et les injonctions circulant dans ces plateformes affectait notre attention et notre façon d’être au monde ?",

    color: '#241454',
  },
  {
    id: 'axe2',
    shortLabel: 'Axe 02',
    label: 'La construction et la circulation des récits identitaires',
    description: 'Analyse phénoménologique des discours qui véhiculent des injonctions comportementales ayant pour effet d’inciter l’individu à adopter certaines conduites et de s’ajuster à certaines normes',
    color: '#EC1E96',
  },
  {
    id: 'axe3',
    shortLabel: 'Axe 03',
    label: "L'influence des injonctions attentionnelles sur nos comportements",
    description: "Analyse des injonctions numériques vécues comme émancipatrices alors qu'elles engendrent de nouveaux mécanismes de contrôle.",
    color: '#2F3FA8',
  },
  {
    id: 'axe4',
    shortLabel: 'Axe 04',
    label: "Les usages désindividuants et agentifs de l'IA générative",
    description: "Explorer les conditions d’émergence d'une interaction humain machine individuante et analyse des usages de l'IA qui tendent à encourager l'individualisation entendue comme repli sur soi.", 
    color: '#2FA88A',
  },
];

export function getAxeColor(axeId) {
  return AXES.find((a) => a.id === axeId)?.color || '#9CA3AF';
}