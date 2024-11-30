import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';
import { ConnectionFormData } from '../types';

interface DatabaseConnectionFieldsProps {
  form: UseFormReturn<ConnectionFormData>;
  onTest: (data: any) => Promise<void>;
  isTesting: boolean;
}

export function DatabaseConnectionFields({ form, onTest, isTesting }: DatabaseConnectionFieldsProps) {
  const handleTest = async () => {
    const data = form.getValues();
    await onTest(data);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Database Connection</h3>
          <p className="text-sm text-muted-foreground">Configure your PostgreSQL database connection</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Host</Label>
            <Input
              {...form.register('host_name')}
              placeholder="localhost"
            />
          </div>

          <div className="space-y-2">
            <Label>Port</Label>
            <Input
              type="number"
              {...form.register('port')}
              placeholder="5432"
            />
          </div>

          <div className="space-y-2">
            <Label>Database Name</Label>
            <Input
              {...form.register('database_name')}
              placeholder="database"
            />
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              {...form.register('conn_user')}
              placeholder="username"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              {...form.register('conn_pass')}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
          >
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </div>
      </div>
    </Card>
  );
}