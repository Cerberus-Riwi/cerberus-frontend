import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import './index.css'
import { AuthPage } from './components/auth/AuthPage'
import { AppShell } from './components/shell/AppShell'
import { ScansListPage } from './pages/ScansListPage'
import { ScanDetailPage } from './pages/ScanDetailPage'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <AuthPage mode="login" />,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <AuthPage mode="register" />,
})

// Layout del panel: envuelve las vistas con el sidebar
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppShell,
})

const scansRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/scans',
  component: ScansListPage,
})

const scanDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/scans/$scanId',
  component: ScanDetailPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  appRoute.addChildren([scansRoute, scanDetailRoute]),
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
