import React from 'react';
import { CheckCircle, AlertCircle, X, Settings } from 'lucide-react';

export default function AlertBanner({ alert, onDismiss, onOpenConfig }) {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';
  const isConnectionError = !isSuccess && (
    (alert.message || '').includes('Failed to connect') ||
    (alert.message || '').includes('Failed to fetch') ||
    (alert.message || '').includes('timed out')
  );

  return (
    <div className={`alert-banner ${isSuccess ? 'alert-success' : 'alert-error'}`} role="alert">
      <div className="alert-content">
        {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <div>
          <span>{alert.message}</span>
          {isConnectionError && onOpenConfig && (
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={onOpenConfig}
              >
                <Settings size={14} />
                <span>Set Render Backend URL</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <button 
        type="button" 
        className="alert-close-btn" 
        onClick={onDismiss} 
        aria-label="Dismiss alert"
      >
        <X size={16} />
      </button>
    </div>
  );
}
