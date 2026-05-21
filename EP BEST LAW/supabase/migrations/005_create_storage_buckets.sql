-- Create storage bucket for firm logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('firm-logos', 'firm-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view firm logos
CREATE POLICY "Firm logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'firm-logos');

-- Policy: Authenticated users can upload their own firm logos
CREATE POLICY "Users can upload their own firm logos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'firm-logos' 
    AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own firm logos
CREATE POLICY "Users can update their own firm logos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'firm-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own firm logos
CREATE POLICY "Users can delete their own firm logos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'firm-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
