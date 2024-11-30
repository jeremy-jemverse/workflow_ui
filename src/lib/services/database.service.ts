import axios from 'axios';

interface ExecuteQueryParams {
  connectionDetails: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl: boolean;
  };
  query: string;
}

export class DatabaseService {
  private static readonly API_URL = 'https://flownodes.onrender.com/api/nodes/postgres';

  static async executeQuery({ connectionDetails, query }: ExecuteQueryParams) {
    try {
      const response = await axios.post(`${this.API_URL}/execute-query`, {
        connectionDetails,
        query
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to execute query');
    }
  }

  static async testConnection(connectionDetails: ExecuteQueryParams['connectionDetails']) {
    try {
      const response = await this.executeQuery({
        connectionDetails,
        query: 'SELECT 1'
      });
      return {
        success: true,
        message: 'Connection successful'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Connection failed'
      };
    }
  }

  static generateInsertQuery(data: any) {
    const fields = [
      'connection_name',
      'connection_category',
      'connection_type',
      'host_name',
      'port',
      'database_name',
      'conn_user',
      'conn_pass',
      'ssl',
      'url',
      'api_key',
      'api_secret',
      'base_url',
      'auth_type'
    ];

    const values = fields.map(field => {
      const value = data[field];
      if (value === undefined || value === '') return 'NULL';
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value;
      return `'${value}'`;
    });

    return `
      INSERT INTO public.connection_details (
        id,
        created_at,
        ${fields.join(',\n        ')}
      )
      VALUES (
        gen_random_uuid(),
        CURRENT_TIMESTAMP,
        ${values.join(',\n        ')}
      )
      RETURNING id;
    `;
  }
}