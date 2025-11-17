import { Client } from "appwrite";

// Get environment variables with fallbacks
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!projectId) {
  console.error('VITE_APPWRITE_PROJECT_ID is not set. Please add it to your Vercel environment variables.');
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId || 'demo-project');

console.log('Appwrite config:', { endpoint, projectId: projectId ? 'Set' : 'Missing' });

export default client;