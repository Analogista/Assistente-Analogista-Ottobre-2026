const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /localStorage\.setItem\('analogista_local_reports', JSON\.stringify\(updated, \(\w+, \w+\) => \{[\s\S]*?return \w+;[\s\S]*?\}\)\);/g;

code = code.replace(regex, `localStorage.setItem('analogista_local_reports', JSON.stringify(updated, (() => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value) || key === 'sourceEvent' || key === '_reactName' || key === '_targetInst' || key === 'nativeEvent') {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
})()));`);

fs.writeFileSync('src/App.tsx', code);
