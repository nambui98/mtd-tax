import { api } from '@/services/api';
import { InsertClient } from '@workspace/database';

export async function createClient(client: InsertClient) {
    const response = await api.post('/clients', client);
    return response.data;
}
