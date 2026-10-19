const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexButtonsGrid = /<div className="grid grid-cols-1 md:grid-cols-3 gap-4">([\s\S]*?)<\/div>\s*<AnimatePresence mode="wait">/;
const matchButtons = code.match(regexButtonsGrid);
if (matchButtons) {
  const replacementButtonsGrid = `<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
${matchButtons[1]}</div>

        {state.conflictType === "SE' STESSO/A" && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] md:text-xs font-bold text-amber-800 text-center uppercase tracking-wider">
              Suggerimento: chiedere se trovasi anche in conflitto col Destino
            </p>
          </div>
        )}

        {((state.inductor === 'Mastro di Chiavi-Lucignolo' && state.conflictType === 'i GENITORI') || 
          (state.inductor === 'Guardiano di Porta-Grillo Parlante' && state.conflictType === 'ALTRI')) && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] md:text-xs font-bold text-rose-700 text-center uppercase tracking-wider">
              C'È DISCORDANZA TRA {state.inductor.split('-')[0].toUpperCase()} E {state.conflictType}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">`;
  code = code.replace(regexButtonsGrid, replacementButtonsGrid);
  fs.writeFileSync('src/App.tsx', code);
}
