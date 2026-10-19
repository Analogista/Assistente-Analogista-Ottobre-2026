const fs = require('fs');
const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

blueprint.entities.Feedback = {
  title: "User Feedback",
  description: "Feedback submitted by users",
  type: "object",
  properties: {
    userId: { type: "string" },
    userEmail: { type: "string" },
    ratingOscillation: { type: "number" },
    ratingQuestions: { type: "number" },
    ratingFunctions: { type: "number" },
    ratingMethod: { type: "number" },
    deviceType: { type: "string" },
    os: { type: "string" },
    browser: { type: "string" },
    openFeedback: { type: "string" },
    feedbackInduttore: { type: "string" },
    feedbackPuntiDistonici: { type: "string" },
    feedbackTimeLine: { type: "string" },
    createdAt: { type: "string", "format": "date-time" }
  },
  required: ["userId", "ratingFunctions", "createdAt"]
};

blueprint.firestore["/feedback/{feedbackId}"] = {
  schema: "Feedback",
  description: "User feedback collection"
};

fs.writeFileSync('firebase-blueprint.json', JSON.stringify(blueprint, null, 2));
