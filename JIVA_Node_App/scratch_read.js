const xlsx = require('xlsx');
const path = require('path');

const downloadsDir = 'C:\\Users\\AsvanthikaM\\Downloads';
const files = [
  'JIVA Laboratory Packages Quotation.xlsx',
  'JIVA_Packages_List.xlsx'
];

files.forEach(fileName => {
  const filePath = path.join(downloadsDir, fileName);
  console.log(`\n========================================`);
  console.log(`Reading file: ${fileName}`);
  console.log(`========================================`);
  
  try {
    const workbook = xlsx.readFile(filePath);
    console.log('Sheets found:', workbook.SheetNames);
    
    workbook.SheetNames.forEach(sheetName => {
      console.log(`\n--- Sheet: ${sheetName} ---`);
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      // Print first 25 rows to get a good overview
      data.slice(0, 25).forEach((row, idx) => {
        console.log(`Row ${idx + 1}:`, row);
      });
    });
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
  }
});
