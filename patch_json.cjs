const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/JSON\.stringify\(updated\)/g, `JSON.stringify(updated, (key, value) => {
  if (key === 'sourceEvent' || key === '_reactName' || key === '_targetInst' || key === 'nativeEvent') return undefined;
  return value;
})`);

fs.writeFileSync('src/App.tsx', code);
