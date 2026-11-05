import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, X, Save } from 'lucide-react';

const INITIAL_FORM = {
  firstname: '',
  lastname: '',
  course: '',
  section: '',
};

export default function StudentForm({ isOpen, student, onSubmit, onClose, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(student && student.id);

  // Sync form when student prop changes or modal opens
  useEffect(() => {
    if (student) {
      setFormData({
        firstname: student.firstname || '',
        lastname: student.lastname || '',
        course: student.course || '',
        section: student.section || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [student, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.firstname.trim()) errs.firstname = 'First name is required.';
    if (!formData.lastname.trim()) errs.lastname = 'Last name is required.';
    if (!formData.course.trim()) errs.course = 'Course is required (e.g. BSCS, BSIT).';
    if (!formData.section.trim()) errs.section = 'Section is required (e.g. 3A, 4B).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      course: formData.course.trim(),
      section: formData.section.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            {isEditMode ? <UserCheck size={22} /> : <UserPlus size={22} />}
            <h3>{isEditMode ? `Edit Student (#${student.id})` : 'Add New Student'}</h3>
          </div>
          <button 
            type="button" 
            className="icon-button" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body form-grid">
            <div className="form-group">
              <label htmlFor="firstname">First Name <span className="required">*</span></label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                className={`form-input ${errors.firstname ? 'input-error' : ''}`}
                placeholder="e.g. Maria"
                value={formData.firstname}
                onChange={handleChange}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.firstname && <span className="error-message">{errors.firstname}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Last Name <span className="required">*</span></label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                className={`form-input ${errors.lastname ? 'input-error' : ''}`}
                placeholder="e.g. Santos"
                value={formData.lastname}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.lastname && <span className="error-message">{errors.lastname}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="course">Course <span className="required">*</span></label>
              <input
                id="course"
                name="course"
                type="text"
                className={`form-input ${errors.course ? 'input-error' : ''}`}
                placeholder="e.g. BS Information Technology"
                value={formData.course}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.course && <span className="error-message">{errors.course}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="section">Section <span className="required">*</span></label>
              <input
                id="section"
                name="section"
                type="text"
                className={`form-input ${errors.section ? 'input-error' : ''}`}
                placeholder="e.g. WMD3A"
                value={formData.section}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.section && <span className="error-message">{errors.section}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Student' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
