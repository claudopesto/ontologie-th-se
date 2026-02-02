const url = 'https://sheets.googleapis.com/v4/spreadsheets/1N-6a1jDlqqxrn_jNYVw-f98BsgqcCCPnCOCnwNUxEGw/values/concepts!A:N?key=AIzaSyBaYOTs8pGLtN_UPAqR2cmAuh139krUx3o';

fetch(url)
  .then(r => r.json())
  .then(data => {
    const rows = data.values;
    const headers = rows[0];
    console.log('Headers:', headers);
    console.log('---');
    // Find thermodynamique
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] && row[1].toLowerCase().includes('thermodynamique')) {
        console.log('Row index:', i);
        console.log('Label (B):', row[1]);
        console.log('Travaux (C):', row[2]);
        console.log('Hypothèse thèse (M):', row[12]);
        console.log('Hypothèse CIENS (N):', row[13]);
      }
    }
  })
  .catch(e => console.error(e));
