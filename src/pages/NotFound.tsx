import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSeo } from "../hooks/use-seo";

const NotFound = () => {
  const location = useLocation();

  useSeo({
    title: "Page Not Found | El Paso's Best Lawyers",
    description:
      "The page you requested could not be found on El Paso's Best Lawyers.",
    path: location.pathname,
    robots: "noindex, nofollow",
    canonical: false,
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 rounded-lg border border-border bg-card shadow-md animate-slide-in">
        <h1 className="text-5xl font-bold mb-6 text-primary">404</h1>

        <p className="text-xl text-card-foreground mb-6">
          Page not found
        </p>

        <a
          href="/"
          className="text-primary hover:text-primary/80 underline transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;