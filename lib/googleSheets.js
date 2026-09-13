const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const RANGE = 'concepts!A:O';

export function splitMultipleValues(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter((item) => item && item.length > 0);
}

export async function fetchConceptsFromSheet() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch data: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    const concepts = rows
      .slice(1)
      .map((row) => ({
        label: (row[1] || '').trim(),
        travaux: (row[2] || '').trim(),
        definition: (row[3] || '').trim(),
        auteur1: (row[4] || '').trim(),
        reference_auteur1: (row[5] || '').trim(),
        citation_auteur1: (row[6] || '').trim(),
        auteur2: (row[7] || '').trim(),
        reference_auteur2: (row[8] || '').trim(),
        citation_auteur2: (row[9] || '').trim(),
        relations: (row[10] || '').trim(),
        categorie: (row[11] || '').trim(),
        hypothese_these: (row[12] || '').trim(),
        hypothese_ciens: (row[13] || '').trim(),
        axe: (row[14] || '').trim(),
      }))
      .filter((concept) => concept.label);

    return concepts;
  } catch (error) {
    console.error('Error fetching concepts:', error);
    throw error;
  }
}