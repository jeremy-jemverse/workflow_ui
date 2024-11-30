import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { ConnectionFormData } from '../types';
import { ConnectionConfirmationDialog } from './ConnectionConfirmationDialog';
import { DatabaseConnectionFields } from './DatabaseConnectionFields';
import { ApiConnectionFields } from './ApiConnectionFields';
import { useToast } from '@/hooks/use-toast';
import { Database, Globe, Loader2 } from 'lucide-react';

const connectionSchema = z.object({
  connection_name: z.string().min(1, 'Connection name is required'),
  connection_category: z.enum(['database', 'api']),
  connection_type: z.enum(['host', 'url']).default('host'),
  // Database fields
  host_name: z.string().optional(),
  port: z.coerce.number().optional(),
  database_name: z.string().optional(),
  conn_user: z.string().optional(),
  conn_pass: z.string().optional(),
  ssl: z.boolean().optional(),
  // API fields
  url: z.string().optional(),
  api_key: z.string().optional(),
  api_secret: z.string().optional(),
  base_url: z.string().optional(),
  auth_type: z.enum(['bearer', 'basic', 'apiKey']).optional(),
});

interface ConnectionFormProps {
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  isLoading: boolean;
}

export function ConnectionForm({ onSubmit, isLoading }: ConnectionFormProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<ConnectionFormData | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      connection_category: 'database',
      connection_type: 'host',
      ssl: true,
      port: 5432,
    },
  });

  const connectionCategory = form.watch('connection_category');

  const handleTestConnection = async (data: ConnectionFormData) => {
    try {
      setTestingConnection(true);
      setError(null);
      
      const result = await DatabaseService.testConnection({
        host: data.host_name || '',
        port: Number(data.port) || 5432,
        database: data.database_name || '',
        user: data.conn_user || '',
        password: data.conn_pass || '',
        ssl: data.ssl || false
      });
      
      if (result.success) {
        toast({
          title: 'Connection Test Successful',
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connection');
      toast({
        title: 'Connection Test Failed',
        description: 'Failed to test connection. Please check your settings.',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (data: ConnectionFormData) => {
    try {
      setError(null);
      const query = SqlService.generateInsertQuery(data);
      setSqlQuery(query);
      setFormData(data);
      setShowConfirmation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to prepare connection data');
      toast({
        title: 'Error',
        description: 'Failed to prepare connection data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    if (!formData) return;
    try {
      setError(null);
      await onSubmit(formData);
      setShowConfirmation(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Connection has been created successfully.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection');
      toast({
        title: 'Error',
        description: 'Failed to create connection. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <div className="space-y-2">
          <Label>Connection Name</Label>
          <Input 
            {...form.register('connection_name')} 
            placeholder="Enter a name for this connection"
            className="max-w-md"
          />
          {form.formState.errors.connection_name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.connection_name.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className={`p-6 cursor-pointer transition-colors hover:bg-accent ${
              connectionCategory === 'database' ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
            onClick={() => form.setValue('connection_category', 'database')}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${
                connectionCategory === 'database' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Database Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to PostgreSQL, MySQL, or other databases
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-colors hover:bg-accent ${
              connectionCategory === 'api' ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
            onClick={() => form.setValue('connection_category', 'api')}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${
                connectionCategory === 'api' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">API Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to REST APIs and web services
                </p>
              </div>
            </div>
          </Card>
        </div>

        {connectionCategory === 'database' ? (
          <DatabaseConnectionFields
            form={form}
            onTest={handleTestConnection}
            isTesting={testingConnection}
          />
        ) : (
          <ApiConnectionFields
            form={form}
            onTest={handleTestConnection}
            isTesting={testingConnection}
          />
        )}

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Connection'
            )}
          </Button>
        </div>
      </form>

      {formData && (
        <ConnectionConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          data={formData}
          sqlQuery={sqlQuery}
          onConfirm={handleConfirm}
          isLoading={isLoading}
        />
      )}
    </>
  );
}