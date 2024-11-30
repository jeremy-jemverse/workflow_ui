export interface ConnectionDetails {
  id: string;
  created_at: string;
  last_used: string | null;
  connection_name: string;
  connection_category: 'database' | 'api';
  connection_type: 'host' | 'url';
  host_name?: string;
  port?: number;
  database_name?: string;
  conn_user?: string;
  conn_pass?: string;
  ssl?: boolean;
  url?: string;
  api_key?: string;
  api_secret?: string;
  base_url?: string;
  auth_type?: 'bearer' | 'basic' | 'apiKey';
}

export type ConnectionFormData = Omit<ConnectionDetails, 'id' | 'created_at' | 'last_used'>;