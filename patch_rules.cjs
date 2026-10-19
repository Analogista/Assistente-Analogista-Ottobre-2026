const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

// Insert isValidFeedback
const isValidFeedbackCode = `    function isValidFeedback(data) {
      return data.keys().hasAll(["userId", "ratingFunctions", "createdAt"]) &&
             data.userId == request.auth.uid &&
             data.ratingFunctions is number &&
             (!data.keys().hasAny(["userEmail"]) || data.userEmail is string) &&
             (!data.keys().hasAny(["ratingOscillation"]) || data.ratingOscillation is number) &&
             (!data.keys().hasAny(["ratingQuestions"]) || data.ratingQuestions is number) &&
             (!data.keys().hasAny(["ratingMethod"]) || data.ratingMethod is number) &&
             (!data.keys().hasAny(["deviceType"]) || data.deviceType is string) &&
             (!data.keys().hasAny(["os"]) || data.os is string) &&
             (!data.keys().hasAny(["browser"]) || data.browser is string) &&
             (!data.keys().hasAny(["openFeedback"]) || data.openFeedback is string) &&
             (!data.keys().hasAny(["feedbackInduttore"]) || data.feedbackInduttore is string) &&
             (!data.keys().hasAny(["feedbackPuntiDistonici"]) || data.feedbackPuntiDistonici is string) &&
             (!data.keys().hasAny(["feedbackTimeLine"]) || data.feedbackTimeLine is string) &&
             data.createdAt == request.time;
    }

    // --- Collections ---`;

code = code.replace('// --- Collections ---', isValidFeedbackCode);

const matchFeedbackCode = `    match /feedback/{feedbackId} {
      allow create: if isSignedIn() && isValidId(feedbackId) && isValidFeedback(incoming());
      allow read: if isSignedIn() && request.auth.token.email == 'analogistabrindisi@gmail.com';
      allow update, delete: if false;
    }

    match /users/{userId} {`;

code = code.replace('match /users/{userId} {', matchFeedbackCode);

fs.writeFileSync('firestore.rules', code);
