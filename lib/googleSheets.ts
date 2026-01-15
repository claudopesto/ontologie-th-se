import { Concept } from '@/types/ontology';

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const RANGE = 'concepts!A:N'; // Nom de la feuille: concepts (A to N includes hypotheses)

export async function fetchConceptsFromSheet(): Promise<Concept[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row (index 0)
    const concepts: Concept[] = rows.slice(1).map((row: string[]) => ({
      label: row[1] || '', // Column B (index 1)
      travaux: row[2] || '', // Column C (index 2)
      definition: row[3] || '', // Column D (index 3)
      auteur1: row[4] || '', // Column E (index 4)
      reference_auteur1: row[5] || '', // Column F (index 5)
      citation_auteur1: row[6] || '', // Column G (index 6)
      auteur2: row[7] || '', // Column H (index 7)
      reference_auteur2: row[8] || '', // Column I (index 8)
      citation_auteur2: row[9] || '', // Column J (index 9)
      relations: row[10] || '', // Column K (index 10)
      categorie: row[11] || '', // Column L (index 11)
      hypothese_these: row[12] || '', // Column M (index 12)
      hypothese_ciens: row[13] || '', // Column N (index 13)
    })).filter((concept: Concept) => concept.label); // Filter out empty rows

    return concepts;
  } catch (error) {
    console.error('Error fetching concepts:', error);
    throw error;
  }
}
