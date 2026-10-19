const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Header
code = code.replace(
  '<header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md">',
  '<header className="bg-upda-petrolio border-b border-upda-petrolio/20 sticky top-0 z-50 backdrop-blur-md">'
);

// Header Logo
code = code.replace(
  '<div className="w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 shadow-sm group overflow-hidden">',
  '<div className="w-12 h-12 md:w-10 md:h-10 shrink-0 aspect-square rounded-full flex items-center justify-center bg-white border border-slate-200 shadow-sm group overflow-hidden">'
);

// Header title 1
code = code.replace(
  '<h1 className="text-base md:text-sm font-bold tracking-tighter text-slate-900 uppercase leading-none" style={{ color: \'#1c3b45\' }}>Assistente Analogista</h1>',
  '<h1 className="text-base md:text-sm font-bold tracking-tighter text-white uppercase leading-none">Assistente Analogista</h1>'
);

// Header title 2 (copyright)
code = code.replace(
  '<p className="text-[12px] md:text-[10px] font-mono font-bold text-upda-ciano uppercase tracking-widest mt-1 md:mt-0.5" style={{ color: \'#34a8b4\' }}>© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>',
  '<p className="text-[9px] md:text-[10px] font-mono text-upda-ciano mt-1 md:mt-0.5 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>'
);

// Header title 3 (memoria)
code = code.replace(
  '<p className="text-[10px] md:text-[8px] font-mono uppercase tracking-widest text-slate-400 mt-1 md:mt-0.5" style={{ color: \'#1c3b45\' }}>in memoria di S.Benemeglio</p>',
  '<p className="text-[9px] md:text-[8px] font-mono uppercase tracking-widest text-slate-300 mt-1 md:mt-0.5">in memoria di S.Benemeglio</p>'
);

// Footer
code = code.replace(
  '<footer className="py-8 bg-white border-t border-slate-200">',
  '<footer className="py-8 bg-upda-petrolio border-t border-slate-800">'
);

// Footer Logo
code = code.replace(
  '<div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 overflow-hidden border border-slate-200">',
  '<div className="w-12 h-12 shrink-0 aspect-square rounded-full flex items-center justify-center bg-white overflow-hidden border border-slate-200">'
);

// Footer title 1
code = code.replace(
  '<h1 className="text-sm font-bold tracking-tighter text-slate-900 uppercase leading-none" style={{ color: \'#1c3b45\' }}>Assistente Analogista</h1>',
  '<h1 className="text-sm font-bold tracking-tighter text-white uppercase leading-none">Assistente Analogista</h1>'
);

// Footer title 2 (copyright)
code = code.replace(
  '<p className="text-[10px] font-mono font-bold text-upda-ciano uppercase tracking-widest mt-1" style={{ color: \'#34a8b4\' }}>© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>',
  '<p className="text-[9px] font-mono text-upda-ciano mt-1 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>'
);

// Footer title 3 (memoria)
code = code.replace(
  '<p className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mt-1">in memoria di S.Benemeglio</p>',
  '<p className="text-[8px] font-mono uppercase tracking-widest text-slate-300 mt-1">in memoria di S.Benemeglio</p>'
);

// Nav
code = code.replace(
  '<nav className="bg-[#000277] border-t border-slate-800/40 backdrop-blur-sm overflow-x-auto no-scrollbar">',
  '<nav className="bg-upda-petrolio border-t border-upda-petrolio/20 backdrop-blur-sm overflow-x-auto no-scrollbar">'
);

fs.writeFileSync('src/App.tsx', code);
