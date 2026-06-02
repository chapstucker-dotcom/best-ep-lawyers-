import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yvcuhnnhspqjfnrbkhok.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here';

// Create a mock client for when Supabase is not configured
const createMockClient = (): SupabaseClient => {
  const mockResponse = {
    data: null,
    error: { message: 'Supabase is not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.' }
  };

  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    containedBy: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    range: () => mockQueryBuilder,
    single: () => Promise.resolve(mockResponse),
    maybeSingle: () => Promise.resolve(mockResponse),
    then: (resolve: (value: typeof mockResponse) => void) => Promise.resolve(mockResponse).then(resolve),
  };

  const mockAuth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
    updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: null) => void) => {
      // Call callback once with initial state
      setTimeout(() => callback('INITIAL_SESSION', null), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  };

  const mockStorage = {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      download: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ data: null, error: null }),
      list: () => Promise.resolve({ data: [], error: null }),
    }),
  };

  return {
    from: () => mockQueryBuilder,
    auth: mockAuth,
    storage: mockStorage,
    rpc: () => Promise.resolve(mockResponse),
  } as unknown as SupabaseClient;
};

// Export the supabase client - either real or mock
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Log a warning in development if Supabase is not configured
if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase is not configured. The app will run in demo mode with limited functionality.\n' +
    'To enable full functionality, set the VITE_SUPABASE_ANON_KEY environment variable.\n' +
    'Get your anon key from: https://supabase.com/dashboard/project/yvcuhnnhspqjfnrbkhok/settings/api'
  );
}


