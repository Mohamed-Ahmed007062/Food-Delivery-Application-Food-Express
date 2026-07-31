import React from 'react';
import { Utensils, ShieldCheck, Server, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" />
          <span>Phase 2A — Project Foundation Active</span>
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground font-heading">
          Food Delivery Web Application
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Production-ready architecture built with React 19, Vite, TypeScript, Node.js, Express, MongoDB Atlas & Tailwind CSS.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/health"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
          >
            Check System Health
          </Link>
          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            View OpenAPI Specs
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 text-left shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Clean Architecture</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Feature-based modular design enforcing strict separation of domain rules, use cases, and interfaces.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 text-left shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Strict Validation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Type-safe cross-stack validation using Zod on both client and server layers.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 text-left shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Utensils className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Production Ready</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Configured with Helmet, CORS, Rate Limiting, Winston & Morgan logging, and Swagger docs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
