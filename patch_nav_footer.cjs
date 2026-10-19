const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Header Copyright Font Size & Line Height (CSS 2)
code = code.replace(
  '<p className="text-[9px] md:text-[10px] font-mono text-upda-ciano mt-1 md:mt-0.5 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>',
  '<p className="text-[7px] leading-[13.5px] font-mono text-upda-ciano mt-1 md:mt-0.5 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>'
);

// Header button SVG (CSS 3) - Looking for the login/logout button in header.
// It's in the header: <div className="hidden md:flex items-center gap-4"> -> button
// We will replace the text-slate-400 / text-upda-ciano on the button's SVG.
code = code.replace(
  '<button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">',
  '<button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[#ffffff] rounded-lg transition-colors border border-slate-700">'
);
code = code.replace(
  '<button onClick={() => signOut(auth)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">',
  '<button onClick={() => signOut(auth)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[#ffffff] rounded-lg transition-colors border border-slate-700">'
);
// Make the SVGs inside those buttons inherit color or explicitly white
code = code.replace(
  '<LogIn size={14} className="text-upda-ciano" />',
  '<LogIn size={14} className="text-[#ffffff]" />'
);
code = code.replace(
  '<LogOut size={14} className="text-slate-400" />',
  '<LogOut size={14} className="text-[#ffffff]" />'
);


// Footer background
code = code.replace(
  '<footer className="py-8 bg-upda-petrolio border-t border-slate-800">',
  '<footer className="py-8 bg-upda-ciano border-t border-upda-petrolio/20">'
);
// Adjust footer text to be petrolio or white (user asked for a button to be #f5f5f5 in footer)
code = code.replace(
  '<h1 className="text-sm font-bold tracking-tighter text-white uppercase leading-none">Assistente Analogista</h1>',
  '<h1 className="text-sm font-bold tracking-tighter text-upda-petrolio uppercase leading-none">Assistente Analogista</h1>'
);
code = code.replace(
  '<p className="text-[9px] font-mono text-upda-ciano mt-1 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>',
  '<p className="text-[9px] font-mono text-upda-petrolio mt-1 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>'
);
code = code.replace(
  '<p className="text-[8px] font-mono uppercase tracking-widest text-slate-300 mt-1">in memoria di S.Benemeglio</p>',
  '<p className="text-[8px] font-mono uppercase tracking-widest text-upda-petrolio/80 mt-1">in memoria di S.Benemeglio</p>'
);

// Footer button (Esporta PDF or Login/Logout) color
code = code.replace(
  '<button onClick={handleLogin} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-mono uppercase tracking-wider text-xs border border-slate-700 w-full md:w-auto">',
  '<button onClick={handleLogin} className="flex items-center justify-center gap-2 px-6 py-3 bg-upda-petrolio hover:bg-upda-petrolio/90 text-[#f5f5f5] rounded-xl transition-colors font-mono uppercase tracking-wider text-xs border border-upda-petrolio/50 w-full md:w-auto">'
);
code = code.replace(
  '<button onClick={() => signOut(auth)} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-mono uppercase tracking-wider text-xs border border-slate-700 w-full md:w-auto">',
  '<button onClick={() => signOut(auth)} className="flex items-center justify-center gap-2 px-6 py-3 bg-upda-petrolio hover:bg-upda-petrolio/90 text-[#f5f5f5] rounded-xl transition-colors font-mono uppercase tracking-wider text-xs border border-upda-petrolio/50 w-full md:w-auto">'
);


// Nav background
code = code.replace(
  '<nav className="bg-upda-petrolio border-t border-upda-petrolio/20 backdrop-blur-sm overflow-x-auto no-scrollbar">',
  '<nav className="bg-upda-ciano border-t border-upda-petrolio/20 backdrop-blur-sm overflow-x-auto no-scrollbar">'
);

// Nav buttons active/inactive colors
// Inactive: "text-slate-300 hover:text-white hover:bg-slate-800/40"
// Active: "text-upda-ciano bg-upda-ciano/5 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]"
code = code.replace(
  'activeTab === tab.id \n                    ? "text-upda-ciano bg-upda-ciano/5 shadow-[inset_0_0_15px_rgba(52,168,180,0.05)]" \n                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"',
  'activeTab === tab.id \n                    ? "text-upda-petrolio bg-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" \n                    : "text-upda-petrolio/70 hover:text-upda-petrolio hover:bg-white/10"'
);

// Nav icons
// activeTab === tab.id ? "text-upda-ciano" : "text-slate-400"
code = code.replace(
  'activeTab === tab.id ? "text-upda-ciano" : "text-slate-400"',
  'activeTab === tab.id ? "text-upda-petrolio" : "text-upda-petrolio/70"'
);

// Nav text colors
// activeTab === tab.id ? "text-upda-ciano" : "text-slate-100"
code = code.replace(
  'activeTab === tab.id ? "text-upda-ciano" : "text-slate-100"',
  'activeTab === tab.id ? "text-upda-petrolio" : "text-upda-petrolio/80"'
);

// Nav active indicator
// bg-upda-ciano shadow-[0_0_10px_rgba(52,168,180,0.5)]
code = code.replace(
  'bg-upda-ciano shadow-[0_0_10px_rgba(52,168,180,0.5)]',
  'bg-upda-petrolio shadow-[0_0_10px_rgba(28,59,69,0.5)]'
);

fs.writeFileSync('src/App.tsx', code);
