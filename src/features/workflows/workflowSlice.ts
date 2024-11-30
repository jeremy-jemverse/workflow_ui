import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Workflow {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

interface WorkflowState {
  items: Workflow[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  sortBy: 'title' | 'createdAt' | 'status';
  sortOrder: 'asc' | 'desc';
}

const initialState: WorkflowState = {
  items: [],
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const workflowSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'title' | 'createdAt' | 'status'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const { setViewMode, setSearchQuery, setSortBy, setSortOrder } = workflowSlice.actions;
export default workflowSlice.reducer;