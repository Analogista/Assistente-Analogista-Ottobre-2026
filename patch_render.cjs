const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change "Modulo X di 6" to only show if activeTab <= 6
code = code.replace(
  '<p \n                        className="text-[12px] md:text-[10px] text-slate-900 uppercase font-mono tracking-[0.2em] mt-2 md:mt-1 flex items-center justify-center border border-upda-ciano/20 rounded-lg bg-upda-ciano/5 notranslate"\n                        style={{ height: \'54px\', width: \'280px\' }}\n                        translate="no"\n                      >\n                        Modulo {activeTab} di 6 • {state.subject.name || \'Nuovo Soggetto\'}\n                      </p>',
  `{activeTab <= 6 && (
    <p 
      className="text-[12px] md:text-[10px] text-slate-900 uppercase font-mono tracking-[0.2em] mt-2 md:mt-1 flex items-center justify-center border border-upda-ciano/20 rounded-lg bg-upda-ciano/5 notranslate"
      style={{ height: '54px', width: '280px' }}
      translate="no"
    >
      Modulo {activeTab} di 6 • {state.subject.name || 'Nuovo Soggetto'}
    </p>
  )}`
);

// Add 7 to the map for dots if needed, but it's hardcoded to [1,2,3,4,5,6]. 
// That's fine, let's keep the dots for the main 6 modules, or hide them for Feedback.
code = code.replace(
  '<div className="flex gap-1.5">',
  '{activeTab <= 6 && <div className="flex gap-1.5">'
);
code = code.replace(
  ']))}                    </div>',
  ']))}                    </div>}'
);

// Add the rendering of activeTab === 7
code = code.replace(
  '{activeTab === 6 && renderHistoryModule()}',
  '{activeTab === 6 && renderHistoryModule()}\n                  {activeTab === 7 && <FeedbackForm onClose={() => setActiveTab(1)} />}'
);

fs.writeFileSync('src/App.tsx', code);
