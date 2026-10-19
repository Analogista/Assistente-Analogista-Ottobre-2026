const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexH3 = /<h3 className="text-\[11px\] font-sans font-bold uppercase tracking-\[0\.1em\] text-white bg-\[\#0b28a5\] h-\[86px\] w-\[263\.4px\] mb-\[14px\] text-center flex items-center justify-center p-4 mx-auto rounded-xl shadow-lg border-2 border-white\/20">Chiedere all'inconscio del cliente: "Caro inconscio, la causa di questo malessere\/problema da risolvere, riguarda il conflitto con\.\.\."<\/h3>/;
const replacementH3 = `<h3 className="text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-white bg-upda-ciano py-4 px-6 mx-auto rounded-xl shadow-lg border-2 border-white/20 text-center leading-relaxed max-w-3xl">Selezionare sotto il risultato emerso dalla domanda posta al soggetto in Metacomunicazione, chiedere: Caro inconscio, in questo momento, la causa di questa crisi/malessere riguarda un conflitto con: (Genitori-Altri-Te Stesso)</h3>`;

code = code.replace(regexH3, replacementH3);

const regexButtonsGrid = /<div className="grid grid-cols-1 md:grid-cols-3 gap-4">([\s\S]*?)<\/button>\s*\);\s*}\)\}\s*<\/div>/;
const matchButtons = code.match(regexButtonsGrid);
if (matchButtons) {
  const replacementButtonsGrid = `${matchButtons[0]}

        {state.conflictType === "SE' STESSO/A" && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-amber-800 text-center uppercase tracking-wider">
              Suggerimento: chiedere se trovasi anche in conflitto col Destino
            </p>
          </div>
        )}

        {((state.inductor === 'Mastro di Chiavi-Lucignolo' && state.conflictType === 'i GENITORI') || 
          (state.inductor === 'Guardiano di Porta-Grillo Parlante' && state.conflictType === 'ALTRI')) && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-rose-700 text-center uppercase tracking-wider">
              C'è discordanza tra {state.inductor.split('-')[0]} e {state.conflictType}
            </p>
          </div>
        )}`;
  code = code.replace(regexButtonsGrid, replacementButtonsGrid);
}

const regexInductorDiv = /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/;
const replacementInductorDiv = `<div className="mb-4 text-center">
        <p className="text-[11px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">
          Selezionare sotto il risultato emerso dal Test "Induzione Metafisica" (Movimento braccio/mano dx/sx).
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">`;
      
code = code.replace(regexInductorDiv, replacementInductorDiv);

fs.writeFileSync('src/App.tsx', code);
