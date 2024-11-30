import axios from 'axios';
import { ConnectionDetails, ConnectionFormData } from './types';
import { SqlService } from '@/lib/services/sql.service';

const API_BASE_URL = 'https://flownodes.onrender.com/api/nodes/postgres';

const DEFAULT_CONNECTION = {
  host: "eca-data-dev-aurora.cluster-c3i2wiuyixpk.eu-central-1.rds.amazonaws.com",
  port: 5432,
  database: "workflow_dev",
  user: "expert",
  password: "expertdev",
  ssl: true
};

export const connectionsApi = {
  getAll: async (): Promise<ConnectionDetails[]> => {
    const response = await axios.post(`${API_BASE_URL}/execute-query`, {
      connectionDetails: DEFAULT_CONNECTION,
      query: 'SELECT * FROM public.connection_details ORDER BY created_at DESC;'
    });
    return response.data;
  },

  create: async (data: ConnectionFormData): Promise<ConnectionDetails> => {
    const query = SqlService.generateInsertQuery(data);
    const response = await axios.post(`${API_BASE_URL}/execute-query`, {
      connectionDetails: DEFAULT_CONNECTION,
      query
    });
    
    if (!response.data) {
      throw new Error('Failed to create connection');
    }

    return response.data;
  },

  test: async (data: ConnectionFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const testQuery = 'SELECT 1;';
      const response = await axios.post(`${API_BASE_URL}/execute-query`, {
        connectionDetails: {
          host: data.host_name || '',
          port: Number(data.port) || 5432,
          database: data.database_name || '',
          user: data.conn_user || '',
          password: data.conn_pass || '',
          ssl: data.ssl || false
        },
        query: testQuery
      });
      
      return {
        success: true,
        message: 'Connection test successful!'
      };
    } catch (error) {
      throw new Error('Connection test failed');
    }
  }
};