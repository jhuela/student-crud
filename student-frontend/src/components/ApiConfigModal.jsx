import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, AlertCircle, X, ExternalLink, RefreshCw } from 'lucide-react';
import { getCurrentApiEndpoint, setCustomApiEndpoint, clearCustomApiEndpoint, studentService } from '../services/studentService';

export default function ApiConfigModal({ isOpen, onClose, onSaved }) {
  const [urlInput, setUrlInput] = useState('');
  const [testStatus, setTestStatus] = useState(null); // { loading, success, message }

  useEffect(() => {
    if (isOpen) {
      setUrlInput(getCurrentApiEndpoint());
      setTestStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTestStatus({ loading: true, message: 'Testing backend connection...' });
    const result = await studentService.testConnection(urlInput);
    if (result.ok) {
      setTestStatus({
        loading: false,
        success: true,
        message: `Successfully connected to backend (${result.endpoint})!`,
      });
    } else {
      setTestStatus({
        loading: false,
        success: false,
        message: `Failed to connect: ${result.error || 'Server returned status ' + result.status}`,
      });
    }
  };

  const handleSave = () => {
    setCustomApiEndpoint(urlInput);
    if (onSaved) onSaved();
    onClose();
  };

  const handleReset = () => {
    clearCustomApiEndpoint();
    setUrlInput(getCurrentApiEndpoint());
    setTestStatus({
      loading: false,
      success: true,
      message: 'Reset to default environment endpoint.',
    });
    if (onSaved) onSaved();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card api-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Settings size={22} />
            <h3>Backend API Configuration</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="config-help-text">
            Enter your Render backend URL (e.g. <code>https://student-backend-xxxx.onrender.com</code>). 
            Render assigns each backend a unique URL in your dashboard.
          </p>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="backendUrl">Backend API URL</label>
            <input
              id="backendUrl"
              type="text"
              className="form-input"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setTestStatus(null);
              }}
              placeholder="https://student-backend-xxxx.onrender.com"
            />
          </div>

          {testStatus && (
            <div
              className={`test-result-box ${testStatus.loading ? 'loading' : testStatus.success ? 'success' : 'error'}`}
            >
              {testStatus.loading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>{testStatus.message}</span>
                </>
              ) : testStatus.success ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>{testStatus.message}</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>{testStatus.message}</span>
                </>
              )}
            </div>
          )}

          <div className="render-tip-box">
            <strong>Where to find your Render backend URL:</strong>
            <ol>
              <li>Go to <a href="https://dashboard.render.com" target="_blank" rel="noreferrer">dashboard.render.com <ExternalLink size={12} style={{ display: 'inline' }} /></a></li>
              <li>Click on <strong>student-backend</strong> (Web Service)</li>
              <li>Copy the URL located under the service title (e.g. <code>https://student-backend-xxxx.onrender.com</code>)</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            <button type="button" className="btn btn-secondary" onClick={handleReset} title="Reset to environment default">
              Reset Default
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleTest}
              disabled={testStatus?.loading}
            >
              <RefreshCw size={14} className={testStatus?.loading ? 'spin' : ''} />
              <span>Test Connection</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save &amp; Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
