import React from 'react';
import { GraduationCap, UserPlus, RefreshCw, Settings } from 'lucide-react';

export default function Header({ 
  studentCount, 
  onOpenAddModal, 
  onRefresh, 
  loading,
  onOpenConfig,
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1>Student Management System</h1>
            <p className="subtitle">React Vite Frontend &bull; Spring Boot REST API</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onOpenConfig}
            title="Configure Backend API URL"
          >
            <Settings size={16} />
            <span className="hide-on-mobile">API Config</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onRefresh} 
            disabled={loading}
            title="Refresh Student List"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span className="hide-on-mobile">Refresh</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onOpenAddModal}
          >
            <UserPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
