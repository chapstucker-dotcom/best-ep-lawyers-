-- Create subscriptions table for managing firm subscription plans
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'professional', 'expert')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    attorney_profile_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_subscriptions_firm_id ON public.subscriptions(firm_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view their own subscription" 
    ON public.subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can update their own subscription
CREATE POLICY "Users can update their own subscription" 
    ON public.subscriptions FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policy: System can insert subscriptions
CREATE POLICY "System can insert subscriptions" 
    ON public.subscriptions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
