const fs = require('fs');
let code = fs.readFileSync('src/components/FeedbackForm.tsx', 'utf8');

const regex = /const userAgent = navigator\.userAgent;[\s\S]*?else if \(\/Safari\/\.test\(userAgent\) && !\/Chrome\/\.test\(userAgent\)\) browser = "Safari";/;
code = code.replace(regex, '');

// Clean up any remaining let os = ... and let browser = ... etc. that didn't match
code = code.replace(/let os = "Sconosciuto";[\s\S]*?let deviceType = "Desktop";/g, '');
code = code.replace(/if \(\/android\/i\.test\(userAgent\)\)[\s\S]*?else if \(\/Linux\/\.test\(userAgent\)\) os = "Linux";/g, '');
code = code.replace(/if \(\/Chrome\/\.test\(userAgent\)[\s\S]*?browser = "Firefox";/g, '');
code = code.replace(/else if \(\/Edg\/\.test\(userAgent\)\) browser = "Edge";/g, '');
code = code.replace(/else if \(\/OPR\/\.test\(userAgent\)\) browser = "Opera";/g, '');
code = code.replace(/const userAgent = navigator\.userAgent;/g, '');

fs.writeFileSync('src/components/FeedbackForm.tsx', code);
