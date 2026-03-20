-- Create firms table
CREATE TABLE IF NOT EXISTS public.firms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    specialties TEXT[], -- Array of practice areas
    years_experience INTEGER,
    team_size INTEGER,
    consultation_fee DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_firms_user_id ON public.firms(user_id);
CREATE INDEX idx_firms_slug ON public.firms(slug);
CREATE INDEX idx_firms_specialties ON public.firms USING GIN(specialties);

-- Enable Row Level Security
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view firms
CREATE POLICY "Firms are viewable by everyone" 
    ON public.firms FOR SELECT 
    USING (true);

-- Policy: Users can insert their own firm
CREATE POLICY "Users can insert their own firm" 
    ON public.firms FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own firm
CREATE POLICY "Users can update their own firm" 
    ON public.firms FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own firm
CREATE POLICY "Users can delete their own firm" 
    ON public.firms FOR DELETE 
    USING (auth.uid() = user_id);
