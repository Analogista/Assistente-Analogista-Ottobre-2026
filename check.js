import { readFileSync } from 'fs';
const content = readFileSync('src/App.tsx', 'utf-8');
console.log(content.substring(0, 150));
