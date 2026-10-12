import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Sparkles, Heart } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Wedding App caught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('forever_together_db_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2D241E] flex flex-col items-center justify-center p-6 text-center font-serif">
          <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl p-8 border border-[#C5A059]/50 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#6B1724]/10 border border-[#6B1724]/30 flex items-center justify-center text-[#6B1724] mx-auto mb-4">
              <Heart className="w-8 h-8 fill-[#6B1724]" />
            </div>

            <p className="font-hindi text-base text-[#8C6D37] font-semibold tracking-wider mb-1">
              ॥ श्री गणेशाय नमः ॥
            </p>
            <h1 className="font-display text-2xl text-[#6B1724] font-bold mb-2">
              Forever Together
            </h1>
            <p className="text-sm text-[#6B5A51] italic mb-6">
              A temporary issue occurred while rendering the luxury wedding invitation.
            </p>

            {this.state.error && (
              <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#C5A059]/30 text-left text-xs text-[#801427] font-mono mb-6 overflow-auto max-h-32">
                {this.state.error.message || 'Unknown render error'}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 rounded-full bg-[#6B1724] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#801427] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Wedding Invitation</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-6 rounded-full bg-[#FAF7F2] text-[#6B1724] border border-[#C5A059]/40 text-xs uppercase tracking-widest font-semibold hover:bg-[#F4EFE6] transition-all"
              >
                <span>Reset to Fresh Royal Invitation</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
