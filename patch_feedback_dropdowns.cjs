const fs = require('fs');
let code = fs.readFileSync('src/components/FeedbackForm.tsx', 'utf8');

// Add state variables for the dropdowns
code = code.replace(
  "const [openFeedback, setOpenFeedback] = useState('');",
  `const [openFeedback, setOpenFeedback] = useState('');
  
  const [device, setDevice] = useState('SMARTPHONE');
  const [os, setOs] = useState('iOS');
  const [browser, setBrowser] = useState('Safari');`
);

// Remove the auto-detection logic in handleSubmit and use state instead
code = code.replace(
  /const userAgent = navigator\.userAgent;[\s\S]*?else if \(\/Edg\/\.test\(userAgent\)\) browser = "Edge";[\s\S]*?else if \(\/Safari\/\.test\(userAgent\)\) browser = "Safari";\n/m,
  ''
);

code = code.replace(
  /deviceType,\s*os,\s*browser,/m,
  'deviceType: device,\n        os,\n        browser,'
);

// Add the dropdowns to the top of the form
const dropdownsJSX = `
        {/* Dati Tecnici */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-upda-ciano rounded-full" />
            Specifiche Tecniche
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Dispositivo</label>
              <select 
                value={device}
                onChange={e => setDevice(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano transition-all"
              >
                <option value="SMARTPHONE">Smartphone</option>
                <option value="TABLET">Tablet</option>
                <option value="PC/MAC">PC / Mac</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Sistema Operativo</label>
              <select 
                value={os}
                onChange={e => setOs(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano transition-all"
              >
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
                <option value="macOS">macOS</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Browser</label>
              <select 
                value={browser}
                onChange={e => setBrowser(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano transition-all"
              >
                <option value="Safari">Safari</option>
                <option value="Chrome">Chrome</option>
                <option value="Firefox">Firefox</option>
                <option value="Edge">Edge</option>
                <option value="Opera">Opera</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>
        </div>
`;

code = code.replace(
  '{/* Valutazioni Generali */}',
  dropdownsJSX + '\n        {/* Valutazioni Generali */}'
);

fs.writeFileSync('src/components/FeedbackForm.tsx', code);
