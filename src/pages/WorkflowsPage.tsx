import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setViewMode,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} from '@/features/workflows/workflowSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { H1, P, Label } from '@/components/ui/typography';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
} from 'lucide-react';

const WorkflowsPage = () => {
  const dispatch = useDispatch();
  const { viewMode, searchQuery, sortBy, sortOrder } = useSelector(
    (state: RootState) => state.workflows
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <H1>Workflows</H1>
          <P className="text-muted-foreground mt-1">
            Create and manage your workflow templates
          </P>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Workflow
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Sort by</Label>
          <Select
            value={sortBy}
            onValueChange={(value: any) => dispatch(setSortBy(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Order</Label>
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
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>View</Label>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Workflow cards will be rendered here */}
      </div>
    </div>
  );
};

export default WorkflowsPage;