const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{showWelcomeBanner && \([\s\S]*?{hasInteracted && <iframe[\s\S]*?<\/iframe>}[\s]*<\/div>/;
const match = code.match(regex);
if (match) {
  const original = match[0];
  const withoutAudio = original.replace(/\{\/\* Hidden Audio Player \*\/\}[\s\S]*?<\/div>/, '');
  
  const extractedAudio = `
      {/* Hidden Audio Player */}
      <div className="fixed top-0 left-0 w-1 h-1 opacity-0 overflow-hidden pointer-events-none">
        {hasInteracted && <iframe
          width="1"
          height="1"
          src="https://www.youtube.com/embed/YjgI7FRy0HM?start=447&autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=YjgI7FRy0HM"
          title="Audio Atmosphere"
          allow="autoplay; encrypted-media"
        ></iframe>}
      </div>`;
      
  code = code.replace(
    '<AnimatePresence>\n        {showWelcomeBanner && (',
    extractedAudio + '\n      <AnimatePresence>\n        {showWelcomeBanner && ('
  );
  code = code.replace(original, withoutAudio);
  
  fs.writeFileSync('src/App.tsx', code);
}
