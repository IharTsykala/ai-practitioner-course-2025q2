import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { config } from 'dotenv';
import fs from 'fs';

config();

const VECTOR_PATH = './faiss.index';

export async function askQuestion(question) {

	const vectorStore = await FaissStore.load(
		VECTOR_PATH,
		new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY })
	);
	
	const relevantDocs = await vectorStore.similaritySearch(question, 4);
	
	const contextText = relevantDocs.map((doc, idx) => `Source ${idx + 1}:\n${doc.pageContent}`).join('\n\n');
	
	const model = new ChatOpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		modelName: 'gpt-3.5-turbo',
		temperature: 0.2
	});
	
	const prompt = [
		{
			role: 'system',
			content: 'You are a helpful AI assistant that answers questions based on museum collection documents. Only use the provided sources. If unsure, say "I don’t know".'
		},
		{
			role: 'user',
			content: `Context:\n${contextText}\n\nQuestion: ${question}`
		}
	];
	
	const response = await model.invoke(prompt);
	
	return {
		answer: response.content,
		sources: relevantDocs.map(doc => doc.metadata)
	};
}
