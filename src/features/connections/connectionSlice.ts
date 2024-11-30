import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionDetails, ConnectionFormData } from './types';
import { connectionsApi } from './api';

interface ConnectionState {
  items: ConnectionDetails[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  sortBy: keyof ConnectionDetails;
  sortOrder: 'asc' | 'desc';
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: ConnectionState = {
  items: [],
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'connection_name',
  sortOrder: 'asc',
  status: 'idle',
  error: null,
};

export const fetchConnections = createAsyncThunk(
  'connections/fetchAll',
  async () => {
    return await connectionsApi.getAll();
  }
);

export const createConnection = createAsyncThunk(
  'connections/create',
  async (data: ConnectionFormData) => {
    return await connectionsApi.create(data);
  }
);

export const updateConnection = createAsyncThunk(
  'connections/update',
  async ({ id, data }: { id: string; data: Partial<ConnectionFormData> }) => {
    return await connectionsApi.update(id, data);
  }
);

export const deleteConnection = createAsyncThunk(
  'connections/delete',
  async (id: string) => {
    await connectionsApi.delete(id);
    return id;
  }
);

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<keyof ConnectionDetails>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch connections';
      })
      .addCase(createConnection.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateConnection.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { setViewMode, setSearchQuery, setSortBy, setSortOrder } = connectionSlice.actions;
export default connectionSlice.reducer;