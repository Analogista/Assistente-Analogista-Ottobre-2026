const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove from tabs array
code = code.replace(
  "{ id: 6, label: 'Archivio', icon: History }, { id: 7, label: 'Feedback', icon: MessageSquare },",
  "{ id: 6, label: 'Archivio', icon: History },"
);

// Add Feedback button next to login/logout in footer
const footerReplacementTarget = `            ) : (
              <button 
                onClick={handleLogout}
                className="text-[10px] text-rose-500 font-bold uppercase border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50 transition-all"
              >
                Logout
              </button>
            )}
          </div>`;

const newFooterButtons = `            ) : (
              <button 
                onClick={handleLogout}
                className="text-[10px] text-rose-500 font-bold uppercase border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50 transition-all"
              >
                Logout
              </button>
            )}
            
            <button 
              onClick={() => setActiveTab(7)}
              className="flex items-center gap-2 px-6 py-2 bg-[#10464e] text-white border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#10464e]/80 transition-all"
            >
              <MessageSquare size={14} />
              Feedback
            </button>
          </div>`;

code = code.replace(footerReplacementTarget, newFooterButtons);

fs.writeFileSync('src/App.tsx', code);
