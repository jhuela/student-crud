import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div className={`alert-banner ${isSuccess ? 'alert-success' : 'alert-error'}`} role="alert">
      <div className="alert-content">
        {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span>{alert.message}</span>
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
