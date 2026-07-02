const xlsx = require('xlsx');
const path = require('path');

const filePath = 'C:\\Users\\AsvanthikaM\\Downloads\\JIVA Laboratory Packages Quotation.xlsx';
const workbook = xlsx.readFile(filePath);

const sheetNames = workbook.SheetNames.filter(name => !name.toLowerCase().includes('summary'));

const allData = [];

sheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  // Find where the table starts.
  // The header row typically contains 'Test Name' and 'Functional Category'
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    if (row.includes('Test Name') || row.includes('Functional Category')) {
      headerIdx = i;
      break;
    }
  }
  
  if (headerIdx === -1) return;
  
  // Package name is usually in row index 3 or 4 (represented as 1-based Row 4 or 5)
  // Let's grab the first non-empty string in rows 3, 4, 5
  let packageName = sheetName;
  for (let i = 3; i <= 5; i++) {
    const row = rows[i] || [];
    const val = row.find(c => typeof c === 'string' && c.trim().length > 5);
    if (val) {
      packageName = val.trim();
      break;
    }
  }
  
  // Extract package type
  const isBase = sheetName.toLowerCase().includes('basic');
  const packageType = isBase ? 'base' : 'addon';
  
  const testNameIdx = rows[headerIdx].indexOf('Test Name');
  const catIdx = rows[headerIdx].indexOf('Functional Category');
  
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const sNo = row[1]; // Serial number or index 1 is a number
    if (typeof sNo !== 'number') continue; // Stop or skip if row does not have a number in second column
    
    const testName = row[testNameIdx];
    const categoryRaw = row[catIdx];
    
    if (!testName) continue;
    
    // Split categories by ' / ', ' , ', ' + '
    const categories = [];
    if (categoryRaw) {
      const rawSplit = categoryRaw.split(/[\/,+]+/);
      rawSplit.forEach(cat => {
        const trimmed = cat.trim();
        if (trimmed && trimmed !== '—' && trimmed !== '-') {
          categories.push(trimmed);
        }
      });
    }
    
    allData.push({
      packageName,
      packageType,
      testName: testName.trim(),
      categories
    });
  }
});

console.log(`Extracted ${allData.length} tests/biomarkers!`);
console.log('Sample data (first 5):');
console.log(JSON.stringify(allData.slice(0, 5), null, 2));

// List all unique categories found
const uniqueCategories = new Set();
allData.forEach(item => {
  item.categories.forEach(c => uniqueCategories.add(c));
});
console.log('\nUnique Categories Found:', Array.from(uniqueCategories).sort());
