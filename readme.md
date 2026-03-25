# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.


## Google Login (Supabase OAuth)

This project supports "Continue with Google" via Supabase OAuth.

### Supabase configuration
1. Supabase Dashboard → Authentication → Providers → Google → Enable.
2. Add your app URLs to **Authentication → URL Configuration → Redirect URLs**, for example:
   - `http://localhost:5173/auth/callback`
   - `https://lawyers-directory-texas.deploypad.app/auth/callback`
   - Any other preview/staging URLs you use.

### DeployPad environment variables (required)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

After setting env vars, redeploy/rebuild the app so Vite picks them up.
