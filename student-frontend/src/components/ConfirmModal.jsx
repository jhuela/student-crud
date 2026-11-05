import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, student, onConfirm, onCancel, isDeleting }) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon danger">
            <AlertTriangle size={22} />
            <h3>Confirm Deletion</h3>
          </div>
          <button 
            type="button" 
            className="icon-button" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to delete student{' '}
            <strong>
              {student.firstname} {student.lastname}
            </strong>{' '}
            (ID: #{student.id})?
          </p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => onConfirm(student.id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
