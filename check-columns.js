const url = 'https://sheets.googleapis.com/v4/spreadsheets/1N-6a1jDlqqxrn_jNYVw-f98BsgqcCCPnCOCnwNUxEGw/values/concepts!A:N?key=AIzaSyBaYOTs8pGLtN_UPAqR2cmAuh139krUx3o';

fetch(url)
  .then(r => r.json())
  .then(data => {
    const rows = data.values;
    const headers = rows[0];
    console.log('Column mapping:');
    headers.forEach((h, i) => console.log(`  Index ${i}: ${h}`));
    console.log('\n---\nThermodynamique entry (all columns):');
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] && row[1].toLowerCase().includes('thermodynamique')) {
        row.forEach((val, idx) => {
          console.log(`  [${idx}] ${headers[idx]}: ${val ? val.substring(0, 80) + (val.length > 80 ? '...' : '') : '(empty)'}`);
        });
      }
    }
  })
  .catch(e => console.error(e));
