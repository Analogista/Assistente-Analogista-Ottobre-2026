const fs = require('fs');
let code = fs.readFileSync('src/components/FeedbackForm.tsx', 'utf8');

const regex = /const handleSubmit = async \(\e: React\.FormEvent\) => \{[\s\S]*?try \{/m;
code = code.replace(regex, `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
      setError("Devi essere loggato per inviare un feedback.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {`);

fs.writeFileSync('src/components/FeedbackForm.tsx', code);
