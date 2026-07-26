-- Run this once in Supabase SQL Editor.
-- Adds expanded public profile fields without removing existing data.

alter table public.firms
  add column if not exists office_hours text,
  add column if not exists languages text[] default '{}'::text[],
  add column if not exists awards text[] default '{}'::text[],
  add column if not exists linkedin_url text,
  add column if not exists facebook_url text,
  add column if not exists instagram_url text,
  add column if not exists google_maps_url text,
  add column if not exists gallery_urls text[] default '{}'::text[];

comment on column public.firms.office_hours is
  'Human-readable office hours shown on the public firm profile.';

comment on column public.firms.languages is
  'Languages spoken by the firm.';

comment on column public.firms.awards is
  'Awards, recognitions, memberships, or credentials.';

comment on column public.firms.gallery_urls is
  'Public image URLs for the firm photo gallery.';
