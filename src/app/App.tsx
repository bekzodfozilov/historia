import React, { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, createHashRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import { useLang } from "@/lib/useLang";

const lz = (f: () => Promise<{ default: React.ComponentType }>) => lazy(f);
const ExplorePage = lz(() => import("@/pages/ExplorePage"));
const CountriesPage = lz(() => import("@/pages/CountriesPage"));
const CountryPage = lz(() => import("@/pages/CountryPage"));
const TimelinePage = lz(() => import("@/pages/TimelinePage"));
const CivilizationsPage = lz(() => import("@/pages/CivilizationsPage"));
const CivilizationPage = lz(() => import("@/pages/CivilizationPage"));
const ComparePage = lz(() => import("@/pages/ComparePage"));
const PeoplePage = lz(() => import("@/pages/PeoplePage"));
const PersonPage = lz(() => import("@/pages/PersonPage"));
const EventsPage = lz(() => import("@/pages/EventsPage"));
const EventPage = lz(() => import("@/pages/EventPage"));
const NotFound = lz(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, retry: 1 } } });

function Layout() {
  const { lang } = useLang();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-3 focus:py-2 focus:text-ink">Skip to content</a>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="container-page pt-40"><div className="skeleton h-16 w-2/3" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}

const routes = [{
  element: <Layout />,
  children: [
    { path: "/", element: <HomePage /> },
    { path: "/explore", element: <ExplorePage /> },
    { path: "/countries", element: <CountriesPage /> },
    { path: "/countries/:code", element: <CountryPage /> },
    { path: "/timeline", element: <TimelinePage /> },
    { path: "/civilizations", element: <CivilizationsPage /> },
    { path: "/civilizations/:slug", element: <CivilizationPage /> },
    { path: "/compare", element: <ComparePage /> },
    { path: "/people", element: <PeoplePage /> },
    { path: "/people/:slug", element: <PersonPage /> },
    { path: "/events", element: <EventsPage /> },
    { path: "/events/:slug", element: <EventPage /> },
    { path: "*", element: <NotFound /> },
  ],
}];

// Hash routing only for the single-file preview build.
const router = (import.meta.env.VITE_HASH_ROUTER ? createHashRouter : createBrowserRouter)(routes);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
