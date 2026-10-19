import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

async function extract() {
  const dirPath = './public/pdf_analogici';
  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));
  
  let combinedText = '';

  for (const file of files) {
    const filePath = `${dirPath}/${file}`;
    console.log(`Processing: ${file}...`);
    const dataBuffer = fs.readFileSync(filePath);

    try {
      const data = await pdf(dataBuffer);
      combinedText += `\n--- SOURCE: ${file} ---\n`;
      combinedText += data.text;
    } catch (err) {
      console.error(`Error parsing PDF ${file}:`, err);
    }
  }

  const tsContent = `export const DISPENSE_CONTENT = ${JSON.stringify(combinedText)};\n`;
  fs.writeFileSync('./src/dispenseAnalogiche.ts', tsContent);
  console.log('Successfully extracted and combined text to ./src/dispenseAnalogiche.ts');
}

extract();
