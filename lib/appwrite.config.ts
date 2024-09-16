import * as sdk from 'node-appwrite';

// Directly assign the variables
const PROJECT_ID = '66e371830030780800d0';
const API_KEY = 'standard_a86434ebb7d29947a108ffe82287f3f481e4f5962318a0c79c6091fa4dfe9670ba87a5ca71d93a7baf000cb09e8a91685294da49b0b6c3bbfae259481237d912baa6b20bc5ea4bd3816ace29f4719fd3b2b8e570d4c08ce5615c6965cbaabcb5e491a469f9d3de9d023a93d6017a389ed051e178175424585f06ff204e975368';
const ENDPOINT = 'https://cloud.appwrite.io/v1';

// Initialize the client
const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);