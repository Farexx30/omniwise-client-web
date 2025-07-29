import { createFileRoute, redirect } from '@tanstack/react-router'

// In the future, we'll probably implement automatic authentication.
const isAuthenticated = false;

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // We don't have an introduction page, so we will redirect to the login page or the main page instantly.
    if (!isAuthenticated) {
        throw redirect({ to: '/login' })
    }
    
    throw redirect({ to: '/home' })
  },
  component: () => null, // We don't need to render anything here since we don't have an introduction page.
})
