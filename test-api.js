// Test script to verify Google Sheets API
const url = `https://sheets.googleapis.com/v4/spreadsheets/1N-6a1jDlqqxrn_jNYVw-f98BsgqcCCPnCOCnwNUxEGw/values/concepts!A1:N10?key=AIzaSyBaYOTs8pGLtN_UPAqR2cmAuh139krUx3o`;

console.log('Testing URL:', url);

fetch(url)
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    return response.text();
  })
  .then(data => {
    console.log('Response data:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });