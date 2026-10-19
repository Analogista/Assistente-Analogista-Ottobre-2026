const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

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

fs.writeFileSync('src/App.tsx', code);
