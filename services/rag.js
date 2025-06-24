import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { config } from 'dotenv';

config();

const VECTOR_PATH = './faiss.index';

export async function askQuestion(question) {
	const start = Date.now();
	
	console.log(`\n🔎 Received question: "${question}"`);
	
	try {
		console.log('📥 Loading vector store...');
		const vectorStore = await FaissStore.load(
			VECTOR_PATH,
			new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY })
		);

		console.log('📚 Searching for relevant documents...');
		const relevantDocs = await vectorStore.similaritySearch(question, 4);
		console.log(`📄 Found ${relevantDocs.length} relevant documents`);

		const contextText = relevantDocs
			.map((doc, idx) => `Source ${idx + 1}:\n${doc.pageContent}`)
			.join('\n\n');

		console.log('🤖 Querying LLM...');
		const model = new ChatOpenAI({
			apiKey: process.env.OPENAI_API_KEY,
			modelName: 'gpt-3.5-turbo',
			temperature: 0.2,
			timeout: 10000
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
		
		const elapsed = ((Date.now() - start) / 1000).toFixed(2);
		console.log(`✅ Answer generated in ${elapsed}s`);
		
		return {
			answer: response.content,
			sources: relevantDocs.map(doc => doc.metadata)
		};
	} catch (err) {
		console.error('❌ Error in askQuestion:', err.message);
		
		return {
			answer: "Sorry, something went wrong while processing your request.",
			sources: []
		};
	}
}
