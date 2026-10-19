const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('MessageSquare')) {
  code = code.replace(
    /import {([^}]+)} from 'lucide-react';/, 
    (match, p1) => `import {${p1} MessageSquare,} from 'lucide-react';`
  );
}

if (!code.includes('FeedbackForm')) {
  code = code.replace(
    /import { SessionState, INITIAL_STATE } from '.\/types';/,
    `import { SessionState, INITIAL_STATE } from './types';\nimport { FeedbackForm } from './components/FeedbackForm';`
  );
}

code = code.replace(
  "{ id: 6, label: 'Archivio', icon: History },",
  "{ id: 6, label: 'Archivio', icon: History },\n    { id: 7, label: 'Feedback', icon: MessageSquare },"
);

// We need to render FeedbackForm when activeTab === 7.
// Let's find where activeTab is handled inside the <main> block.
