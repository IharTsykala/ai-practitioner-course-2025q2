import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAIEmbeddings } from '@langchain/openai';
import { loadDocuments } from './loadDocuments.js';
import { config } from 'dotenv';
import fs from 'fs';

config();

const VECTOR_PATH = './faiss.index';

async function embedAndStore() {
	const documents = await loadDocuments();
	
	const formattedDocs = documents.map(doc => ({
		pageContent: doc.content,
		metadata: { id: doc.id }
	}));
	
	const embeddings = new OpenAIEmbeddings({
		apiKey: process.env.OPENAI_API_KEY
	});
	
	const filteredDocs = formattedDocs.filter(doc =>
		doc.pageContent && doc.pageContent.trim().length > 30
	);
	
	const vectorStore = await FaissStore.fromDocuments(filteredDocs, embeddings);
	
	await vectorStore.save(VECTOR_PATH);
	
	console.log(`Embeddings stored locally at ${VECTOR_PATH}. Total documents: ${formattedDocs.length}`);
}

embedAndStore().catch(console.error);
