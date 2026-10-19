const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{activeTab <= 6 && <div className="flex gap-1\.5">([\s\S]*?)\]\)\)}[\s]*<\/div>[\s]*<\/div>/m;
code = code.replace(regex, (match, inner) => {
  return `{activeTab <= 6 && (
    <div className="flex gap-1.5">
      ${inner}
      ]))}
    </div>
  )}
  </div>`;
});

fs.writeFileSync('src/App.tsx', code);
