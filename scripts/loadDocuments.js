import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

function getAllJsonFiles(dir) {
	let results = [];
	
	const list = fs.readdirSync(dir);
	list.forEach(file => {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		
		if (stat && stat.isDirectory()) {
			results = results.concat(getAllJsonFiles(fullPath));
		} else if (file.endsWith('.json')) {
			results.push(fullPath);
		}
	});
	
	return results;
}

export async function loadDocuments() {
	const files = getAllJsonFiles(dataDir);
	const documents = [];
	
	for (const file of files) {
		const raw = fs.readFileSync(file, 'utf-8');
		try {
			if (!raw || raw.trim().length < 10) continue;
			const json = JSON.parse(raw);
			
			const title = json.title ?? '';
			const description = json.text?.description ?? '';
			const artist = json.people?.map(p => p.name).join(', ') ?? '';
			const culture = json.culture ?? '';
			
			const content = [title, artist, culture, description]
				.filter(Boolean)
				.join('\n');
			
			documents.push({ id: json.id, content });
		} catch (err) {
			console.error(`Error parsing ${file}:`, err.message);
		}
	}
	
	return documents;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	loadDocuments().then(docs => {
		console.log(`Loaded ${docs.length} documents`);
		console.log(docs[0]);
	});
}
