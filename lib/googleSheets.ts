import { Concept } from '@/types/ontology';

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const RANGE = 'concepts!A:N'; // Nom de la feuille: concepts (A to N includes hypotheses)

export async function fetchConceptsFromSheet(): Promise<Concept[]> {
  try {
    console.log('Fetching concepts from Google Sheets...');
    console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
    console.log('API_KEY:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'undefined');
    console.log('RANGE:', RANGE);
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    console.log('URL:', url);

    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch data: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Data received:', data);
    const rows = data.values;
    console.log('Rows count:', rows ? rows.length : 0);

    if (!rows || rows.length === 0) {
      console.log('No rows found');
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

    console.log('Concepts parsed:', concepts.length);
    console.log('First concept:', concepts[0]);
    return concepts;
  } catch (error) {
    console.error('Error fetching concepts:', error);
    throw error;
  }
}
