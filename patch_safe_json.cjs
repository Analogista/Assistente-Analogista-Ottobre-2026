const fs = require('fs');

let firebaseCode = fs.readFileSync('src/firebase.ts', 'utf8');
firebaseCode = firebaseCode.replace(
  /JSON\.stringify\(errInfo\)/g,
  `JSON.stringify(errInfo, (() => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  })())`
);
fs.writeFileSync('src/firebase.ts', firebaseCode);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/JSON\.stringify\(updated.*?\)\)/g, `JSON.stringify(updated, (() => {
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
})())`);
fs.writeFileSync('src/App.tsx', appCode);
