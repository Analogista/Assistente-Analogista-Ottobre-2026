const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix typo text-upda-petrolioxl
code = code.replace(/text-upda-petrolioxl/g, 'text-2xl');

// Footer disclaimer (CSS 1: color: #ffffff;)
code = code.replace(
  '<p className="text-[10px] text-slate-400 font-mono text-center tracking-wider uppercase">',
  '<p className="text-[10px] text-[#ffffff] font-mono text-center tracking-wider uppercase">'
);

// Footer Archivio Cloud (CSS 2: color: #ffffff;)
code = code.replace(
  '<span className="text-[9px] uppercase font-mono text-slate-400">Archivio Cloud</span>',
  '<span className="text-[9px] uppercase font-mono text-[#ffffff]">Archivio Cloud</span>'
);

// Footer status text (CSS 3: color: #ffffff;)
code = code.replace(
  '<span className="text-[10px] text-upda-ciano font-bold uppercase flex items-center gap-1">',
  '<span className="text-[10px] text-[#ffffff] font-bold uppercase flex items-center gap-1">'
);
code = code.replace(
  '<span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">',
  '<span className="text-[10px] text-[#ffffff] font-bold uppercase flex items-center gap-1">'
);

// Footer copyright (CSS 4: font-size: 7px; text-align: center;)
code = code.replace(
  '<p className="text-[9px] font-mono text-upda-petrolio mt-1 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>',
  '<p className="text-[7px] text-center font-mono text-upda-petrolio mt-1 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>'
);

// Footer title (CSS 5: color: #f7f7f7;)
code = code.replace(
  '<h1 className="text-sm font-bold tracking-tighter text-upda-petrolio uppercase leading-none">Assistente Analogista</h1>',
  '<h1 className="text-sm font-bold tracking-tighter text-[#f7f7f7] uppercase leading-none">Assistente Analogista</h1>'
);

// Footer in memoria (CSS 6: color: #ffffff;)
code = code.replace(
  '<p className="text-[8px] font-mono uppercase tracking-widest text-upda-petrolio/80 mt-1">in memoria di S.Benemeglio</p>',
  '<p className="text-[8px] font-mono uppercase tracking-widest text-[#ffffff] mt-1">in memoria di S.Benemeglio</p>'
);

// Main heading (CSS 7: color: #085f52;)
code = code.replace(
  '<h2 className="text-2xl font-bold text-[#1d14cb] tracking-tight text-center notranslate" translate="no">',
  '<h2 className="text-2xl font-bold text-[#085f52] tracking-tight text-center notranslate" translate="no">'
);
code = code.replace(
  '<h2 className="text-upda-petrolioxl font-bold text-[#1d14cb] tracking-tight text-center notranslate" translate="no">', // in case the earlier regex missed it
  '<h2 className="text-2xl font-bold text-[#085f52] tracking-tight text-center notranslate" translate="no">'
);

fs.writeFileSync('src/App.tsx', code);
