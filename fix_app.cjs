const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will fix the condition for activeTab <= 6 and the map
code = code.replace(
  `{activeTab <= 6 && <div className="flex gap-1.5">
                      {[1,2,3,4,5,6].map(i => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-12 h-1.5 rounded-full transition-all duration-500", 
                            i <= activeTab 
                              ? "bg-upda-ciano shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                              : i === 6 
                                ? "bg-transparent border border-[#e0173c]" 
                                : "bg-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>`,
  `{activeTab <= 6 && (
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5,6].map(i => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-12 h-1.5 rounded-full transition-all duration-500", 
                            i <= activeTab 
                              ? "bg-upda-ciano shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                              : i === 6 
                                ? "bg-transparent border border-[#e0173c]" 
                                : "bg-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  )}
                  </div>`
);

fs.writeFileSync('src/App.tsx', code);
