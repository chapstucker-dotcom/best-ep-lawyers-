-- Create analytics table for tracking firm profile views and interactions
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL, -- 'view', 'click_phone', 'click_email', 'click_website'
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX idx_analytics_firm_id ON public.analytics(firm_id);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);

-- Enable Row Level Security
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert analytics events
CREATE POLICY "Anyone can insert analytics events" 
    ON public.analytics FOR INSERT 
    WITH CHECK (true);

-- Policy: Firm owners can view their own analytics
CREATE POLICY "Firm owners can view their own analytics" 
    ON public.analytics FOR SELECT 
    USING (
        firm_id IN (
            SELECT id FROM public.firms WHERE user_id = auth.uid()
        )
    );

-- Create a view for aggregated analytics
CREATE OR REPLACE VIEW public.firm_analytics_summary AS
SELECT 
    f.id as firm_id,
    f.user_id,
    COUNT(CASE WHEN a.event_type = 'view' THEN 1 END) as total_views,
    COUNT(CASE WHEN a.event_type = 'click_phone' THEN 1 END) as phone_clicks,
    COUNT(CASE WHEN a.event_type = 'click_email' THEN 1 END) as email_clicks,
    COUNT(CASE WHEN a.event_type = 'click_website' THEN 1 END) as website_clicks
FROM public.firms f
LEFT JOIN public.analytics a ON f.id = a.firm_id
GROUP BY f.id, f.user_id;
