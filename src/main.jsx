import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { Analytics } from '@vercel/analytics/react'
import { shadcn, dark, neobrutalism } from '@clerk/themes'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey} signInUrl="/sign-in"
        signUpUrl="/sign-up" afterSignOutUrl="/" appearance={{
        baseTheme: shadcn,
      }}>
    <App />
    <Analytics />
    </ClerkProvider>
  </StrictMode>,
)
