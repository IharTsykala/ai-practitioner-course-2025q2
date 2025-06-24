#!/usr/bin/env node
import { config } from 'dotenv';
import { askQuestion } from './services/rag.js';

config();

const input = process.argv.slice(2).join(' ');
if (!input) {
	console.error('❌ Please provide a question.');
	process.exit(1);
}

askQuestion(input)
	.then(({ answer, sources }) => {
		console.log('\n🧠 Answer:\n', answer);
		console.log('\n📚 Sources:\n', sources);
	})
	.catch(err => {
		console.error('❌ Error:', err.message);
	});
