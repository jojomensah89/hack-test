/// <reference types="vite/client" />

import { Toaster } from "@/components/ui/sonner";

import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
	useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/header";
import appCss from "../index.css?url";
import type { QueryClient } from "@tanstack/react-query";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { ConvexReactClient } from "convex/react";
import Loader from "@/components/loader";

import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequest } from '@tanstack/react-start/server'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { fetchSession, getCookieName } from '@convex-dev/better-auth/react-start'
import { authClient } from "@/lib/auth-client";
import { createAuth } from "@hack-test/backend/convex/auth";


const fetchAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { session } = await fetchSession(getRequest())
  const sessionCookieName = getCookieName(createAuth)
  const token = getCookie(sessionCookieName)
  return {
    userId: session?.user.id,
    token,
  }
})
export interface RouterAppContext {
	queryClient: QueryClient;
	convexClient: ConvexReactClient;
	convexQueryClient: ConvexQueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "My App",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootComponent,
	// beforeLoad: async (ctx) => {
	// 	const { userId, token } = await fetchAuth();
	// 	if (token) {
	// 		ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
	// 	}
	// 	return { userId, token };
	// },
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  	const isFetching = useRouterState({ select: (s) => s.isLoading });

  return (
    <ConvexBetterAuthProvider
      client={context.convexClient}
      authClient={authClient}
    >
      <RootDocument>
						{isFetching ? <Loader /> : <Outlet />}
      </RootDocument>
    </ConvexBetterAuthProvider>
  )
}
function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className="dark">
				<head>
					<HeadContent />
				</head>
				<body>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Header />
						{children}
					</div>
					<Toaster richColors />
					<TanStackRouterDevtools position="bottom-left" />
					<Scripts />
				</body>
			</html>
	);
}


