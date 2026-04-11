# Best EP Lawyers

A modern React application for finding employment and labor law firms. Built with Vite, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 Search and filter law firms by practice area and location
- 👥 User authentication with Google OAuth
- 📱 Responsive design for all devices
- 🎨 Modern UI with Radix UI components
- ⚡ Fast development with Vite
- 🔒 Secure authentication with Supabase

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Query, Context API
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd best-ep-lawyers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Go to Authentication > Settings and configure:
      - Site URL: `http://localhost:8080`
      - Redirect URLs: `http://localhost:8080/auth/callback`

   c. Enable Google OAuth in Authentication > Providers

   d. Copy your project URL and anon key

4. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, etc.)
│   ├── Layout.tsx      # Main layout with navigation
│   ├── FirmCard.tsx    # Law firm card component
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── data/               # Static data
│   └── sampleData.ts   # Sample law firm data
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Utility functions
├── pages/              # Page components
│   ├── HomePage.tsx    # Homepage
│   ├── LoginPage.tsx   # Login page
│   ├── SignupPage.tsx  # Signup page
│   ├── DashboardPage.tsx # User dashboard
│   ├── FirmPage.tsx    # Individual firm page
│   ├── CategoryPage.tsx # Category listing page
│   └── AuthCallback.tsx # OAuth callback handler
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Authentication Flow

1. Users can sign up/login with Google OAuth
2. After authentication, users are redirected to the dashboard
3. Auth state is managed globally via React Context
4. Protected routes automatically redirect to login if not authenticated

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Update Supabase redirect URLs to include your production domain
4. Deploy!

### Other Platforms

The app can be deployed to any static hosting service that supports SPA routing:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- etc.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@besteplawyers.com or create an issue in this repository.

By default the wrap is soft, meaning long words may extend past the column width. Setting this to `true` will make it hard wrap at the column width.

##### wordWrap

Type: `boolean`\
Default: `true`

By default, an attempt is made to split words at spaces, ensuring that they don't extend past the configured columns. If wordWrap is `false`, each column will instead be completely filled splitting words as necessary.

##### trim

Type: `boolean`\
Default: `true`

Whitespace on all lines is removed by default. Set this option to `false` if you don't want to trim.

## Related

- [slice-ansi](https://github.com/chalk/slice-ansi) - Slice a string with ANSI escape codes
- [cli-truncate](https://github.com/sindresorhus/cli-truncate) - Truncate a string to a specific width in the terminal
- [chalk](https://github.com/chalk/chalk) - Terminal string styling done right
- [jsesc](https://github.com/mathiasbynens/jsesc) - Generate ASCII-only output from Unicode strings. Useful for creating test fixtures.

## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Josh Junon](https://github.com/qix-)
- [Benjamin Coe](https://github.com/bcoe)

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-wrap_ansi?utm_source=npm-wrap-ansi&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
