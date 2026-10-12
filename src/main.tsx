import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in wedding application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: 'Georgia, serif', color: '#2D241E' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#FFFDF9', padding: '2.5rem', borderRadius: '1.5rem', border: '2px solid rgba(197, 160, 89, 0.5)', boxShadow: '0 10px 25px rgba(107, 23, 36, 0.1)' }}>
            <p style={{ color: '#C5A059', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              ॥ श्री गणेशाय नमः ॥
            </p>
            <h1 style={{ fontSize: '1.8rem', color: '#6B1724', margin: '0.5rem 0 1rem' }}>
              Forever Together · Wedding Invitation
            </h1>
            <p style={{ color: '#4A3E38', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              A temporary issue occurred while loading this page. Please click below to refresh the celebrations.
            </p>
            {this.state.error && (
              <pre style={{ textAlign: 'left', padding: '0.75rem', backgroundColor: '#FAF7F2', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '0.5rem', fontSize: '11px', overflowX: 'auto', color: '#8C6D37', marginBottom: '1.5rem' }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('forever_together_db_v1');
                } catch (e) {
                  // ignore
                }
                window.location.reload();
              }}
              style={{ padding: '0.75rem 2rem', backgroundColor: '#6B1724', color: '#FAF7F2', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Reset & Reload Invitation
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
