export interface Concept {
  label: string;
  travaux: string;
  definition: string;
  auteur1: string;
  reference_auteur1: string;
  citation_auteur1: string;
  auteur2: string;
  reference_auteur2: string;
  citation_auteur2: string;
  relations: string;
  categorie: string;
}

export interface GraphNode {
  id: string;
  label: string;
  color?: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
