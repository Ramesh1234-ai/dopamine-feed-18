import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from "./App.jsx"
import "./styles/index.css"
import ErrorBoundary from "./components/common/ErrorBoundary"
import { ToastProvider } from "./context/ToastContext"
import { SavedArtworksProvider } from "./context/SavedArtworksContext"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ToastProvider>
          <SavedArtworksProvider>
            <Router>
              <App />
            </Router>
          </SavedArtworksProvider>
        </ToastProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
)