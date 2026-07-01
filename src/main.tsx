import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import './index.css'
import { AuthPage } from './components/auth/AuthPage'
import { LandingPage } from './components/landing/LandingPage'
import { UserDashboard } from './components/dashboard/UserDashboard'
import { AdminPanel } from './components/admin/AdminPanel'
import { isAuthenticated, isAdmin } from './lib/auth'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: '/dashboard' })
  },
  component: AuthPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' })
  },
  component: UserDashboard,
})

const scanDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/$scanId',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' })
  },
  component: () => {
    const { scanId } = scanDetailRoute.useParams()
    return <div style={{ padding: 40, color: '#e9eef8', fontFamily: 'monospace' }}>Detalle: {scanId} — próximamente</div>
  },
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' })
    if (!isAdmin())         throw redirect({ to: '/dashboard' })
  },
  component: AdminPanel,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  scanDetailRoute,
  adminRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
