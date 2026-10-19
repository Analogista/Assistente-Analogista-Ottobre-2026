const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Header Copyright Font Size (CSS 9: 6px)
code = code.replace(
  '<p className="text-[7px] leading-[13.5px] font-mono text-upda-ciano mt-1 md:mt-0.5 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>',
  '<p className="text-[6px] leading-[13.5px] font-mono text-upda-ciano mt-1 md:mt-0.5 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>'
);

// Nav active/inactive colors
// Current: activeTab === tab.id ? "text-upda-petrolio" : "text-upda-petrolio/80"
code = code.replace(
  'activeTab === tab.id ? "text-upda-petrolio" : "text-upda-petrolio/80"',
  'activeTab === tab.id ? "text-[#ffffff]" : "text-[#ffffff]/80"'
);

// We should also change the Nav icon colors just in case the user meant them too, 
// though the CSS specifically targeted the span:nth-of-type(1).
// Let's leave icon if they didn't ask, or make it white? The petrolio might look dark against ciano. Actually let's make it white for better contrast as they asked for the text to be white.
code = code.replace(
  'activeTab === tab.id ? "text-upda-petrolio" : "text-upda-petrolio/70"',
  'activeTab === tab.id ? "text-white" : "text-white/70"'
);

// Nav buttons active/inactive background/hover
// Current: 
// activeTab === tab.id 
//   ? "text-upda-petrolio bg-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" 
//   : "text-upda-petrolio/70 hover:text-upda-petrolio hover:bg-white/10"
code = code.replace(
  'activeTab === tab.id \n                    ? "text-upda-petrolio bg-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" \n                    : "text-upda-petrolio/70 hover:text-upda-petrolio hover:bg-white/10"',
  'activeTab === tab.id \n                    ? "text-white bg-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" \n                    : "text-white/70 hover:text-white hover:bg-white/10"'
);

// Footer background (CSS 1: #10464e)
code = code.replace(
  '<footer className="py-8 bg-upda-ciano border-t border-upda-petrolio/20">',
  '<footer className="py-8 bg-[#10464e] border-t border-[#10464e]/20">'
);

// Footer inner div (CSS 2: #099da2)
// <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
code = code.replace(
  '<div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">',
  '<div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#099da2] p-4 rounded-xl">'
); // I'll add some padding and rounding so it looks decent with a background color.

fs.writeFileSync('src/App.tsx', code);
