import { askQuestion } from './services/rag.js';

const question = "Tell me about Japanese ceramics or anything with nature themes.";
// const question = "Find portraits by female artists";
// const question = "Show me artworks related to religion";
// const question = "Find artworks with floral motifs";

askQuestion(question)
	.then(({ answer, sources }) => {
		console.log('\n🧠 Answer:\n', answer);
		console.log('\n📚 Sources:\n', sources);
	})
	.catch(err => {
		console.error('❌ Error:', err);
	});
