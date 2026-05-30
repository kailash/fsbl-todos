import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from './components/ui/tooltip'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found in index.html')
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ErrorBoundary>
  </StrictMode>,
)
