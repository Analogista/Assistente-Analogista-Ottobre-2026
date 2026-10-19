const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add hasInteracted state
code = code.replace(
  'const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);',
  'const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);\n  const [hasInteracted, setHasInteracted] = useState(false);\n\n  useEffect(() => {\n    const handleInteraction = () => setHasInteracted(true);\n    document.addEventListener("click", handleInteraction, { once: true });\n    document.addEventListener("touchstart", handleInteraction, { once: true });\n    return () => {\n      document.removeEventListener("click", handleInteraction);\n      document.removeEventListener("touchstart", handleInteraction);\n    };\n  }, []);'
);

// Modify the iframe to only render if hasInteracted is true
code = code.replace(
  '<iframe\n                width="1"\n                height="1"\n                src="https://www.youtube.com/embed/YjgI7FRy0HM?start=447&autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=YjgI7FRy0HM"\n                title="Audio Atmosphere"\n                allow="autoplay; encrypted-media"\n              ></iframe>',
  '{hasInteracted && <iframe\n                width="1"\n                height="1"\n                src="https://www.youtube.com/embed/YjgI7FRy0HM?start=447&autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=YjgI7FRy0HM"\n                title="Audio Atmosphere"\n                allow="autoplay; encrypted-media"\n              ></iframe>}'
);

// Modify the font-size from text-[9px] to text-[11px]
code = code.replace(
  'className="text-[9px] font-bold uppercase tracking-widest text-[#ca0d19] hover:opacity-80 transition-colors"',
  'className="text-[11px] font-bold uppercase tracking-widest text-[#ca0d19] hover:opacity-80 transition-colors"'
);

fs.writeFileSync('src/App.tsx', code);
