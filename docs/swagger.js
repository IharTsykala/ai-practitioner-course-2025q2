import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'RAG Question API',
			version: '1.0.0',
		},
	},
	apis: ['server/routes/**/*.js'],
});

console.log('Loaded Swagger paths:', Object.keys(swaggerSpec.paths || {}));
