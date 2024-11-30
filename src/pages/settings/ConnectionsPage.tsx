import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setViewMode,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  createConnection,
  type ConnectionDetails
} from '@/features/connections/connectionSlice';
import { ConnectionForm } from '@/features/connections/components/ConnectionForm';
import { H1, P } from '@/components/ui/typography';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Settings2,
  Database,
  Key,
  RefreshCw,
  Loader2
} from 'lucide-react';

const getConnectionIcon = (type: ConnectionDetails['type']) => {
  switch (type) {
    case 'api':
      return RefreshCw;
    case 'database':
      return Database;
    default:
      return Settings2;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-emerald-500/15 text-emerald-500';
    case 'disconnected':
      return 'bg-neutral-500/15 text-neutral-500';
    case 'error':
      return 'bg-red-500/15 text-red-500';
    default:
      return 'bg-neutral-500/15 text-neutral-500';
  }
};

export default function ConnectionsPage() {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, viewMode, searchQuery, sortBy, sortOrder, status } = useSelector(
    (state: RootState) => state.connections
  );

  const handleCreateConnection = async (data: any) => {
    try {
      setIsSubmitting(true);
      await dispatch(createConnection(data)).unwrap();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create connection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.connection_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <H1>Connections</H1>
          <P className="text-muted-foreground mt-1">
            Manage your external service connections and integrations
          </P>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Connection
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-10"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: any) => dispatch(setSortBy(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="connection_name">Name</SelectItem>
            <SelectItem value="type">Type</SelectItem>
            <SelectItem value="last_used">Last Used</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: any) => dispatch(setSortOrder(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => dispatch(setViewMode('grid'))}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => dispatch(setViewMode('list'))}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((connection) => {
            const Icon = getConnectionIcon(connection.type);
            return (
              <Card key={connection.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{connection.connection_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {connection.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor('connected')}>
                        Connected
                      </Badge>
                      {connection.last_used && (
                        <span className="text-xs text-muted-foreground">
                          Last used: {new Date(connection.last_used).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((connection) => {
                const Icon = getConnectionIcon(connection.type);
                return (
                  <TableRow key={connection.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{connection.connection_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {connection.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{connection.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor('connected')}>
                        Connected
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {connection.last_used
                        ? new Date(connection.last_used).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Configure</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Connection</DialogTitle>
            <DialogDescription>
              Configure a new connection to an external service
            </DialogDescription>
          </DialogHeader>
          <ConnectionForm
            onSubmit={handleCreateConnection}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}