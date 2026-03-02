-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
DROP TRIGGER IF EXISTS update_firms_updated_at ON public.firms;
CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON public.firms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from firm name
CREATE OR REPLACE FUNCTION generate_slug(firm_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(regexp_replace(firm_name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Function to get firm average rating
CREATE OR REPLACE FUNCTION get_firm_average_rating(firm_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE firm_id = firm_uuid AND is_approved = true
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get firm review count
CREATE OR REPLACE FUNCTION get_firm_review_count(firm_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE firm_id = firm_uuid AND is_approved = true
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get firm analytics summary (used by dashboard)
CREATE OR REPLACE FUNCTION get_firm_analytics_summary(p_firm_id UUID)
RETURNS TABLE(
    total_views BIGINT,
    total_clicks BIGINT,
    phone_clicks BIGINT,
    email_clicks BIGINT,
    website_clicks BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
        COUNT(*) FILTER (WHERE event_type IN ('click_phone', 'click_email', 'click_website')) as total_clicks,
        COUNT(*) FILTER (WHERE event_type = 'click_phone') as phone_clicks,
        COUNT(*) FILTER (WHERE event_type = 'click_email') as email_clicks,
        COUNT(*) FILTER (WHERE event_type = 'click_website') as website_clicks
    FROM public.analytics
    WHERE firm_id = p_firm_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
