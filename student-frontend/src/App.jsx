import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import ConfirmModal from './components/ConfirmModal';
import AlertBanner from './components/AlertBanner';
import { studentService } from './services/studentService';
import './App.css';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to trigger alert banners
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const dismissAlert = () => {
    setAlert(null);
  };

  // Auto-dismiss alert after 4 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Load students from Spring Boot backend
  const loadStudents = useCallback(async (isInitial = false) => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents();
      // Handle both array and iterable formats
      const studentArray = Array.isArray(data) ? data : (data ? Object.values(data) : []);
      // Sort students by id ascending or descending (id descending puts newest at top)
      studentArray.sort((a, b) => (b.id || 0) - (a.id || 0));
      setStudents(studentArray);
      if (!isInitial) {
        showAlert('Student records refreshed.', 'success');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      showAlert(
        `Failed to connect to student API: ${err.message}. Please check if the Spring Boot backend is running on port 8080.`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents(true);
  }, [loadStudents]);

  // Open modal in Add mode
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  // Close form modal
  const handleCloseFormModal = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  // Save student (either Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent && editingStudent.id) {
        // Update existing student
        const updated = await studentService.updateStudent(editingStudent.id, formData);
        showAlert(`Student ${updated.firstname} ${updated.lastname} updated successfully!`, 'success');
      } else {
        // Create new student
        const created = await studentService.createStudent(formData);
        showAlert(`Student ${created.firstname} ${created.lastname} added successfully!`, 'success');
      }
      setIsFormOpen(false);
      setEditingStudent(null);
      await loadStudents(true);
    } catch (err) {
      console.error('Save failed:', err);
      showAlert(err.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (student) => {
    setDeletingStudent(student);
  };

  // Cancel delete
  const handleCloseDeleteModal = () => {
    setDeletingStudent(null);
  };

  // Confirm delete
  const handleConfirmDelete = async (studentId) => {
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(studentId);
      showAlert(`Student record #${studentId} was successfully deleted.`, 'success');
      setDeletingStudent(null);
      await loadStudents(true);
    } catch (err) {
      console.error('Delete failed:', err);
      showAlert(`Failed to delete student: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      <Header
        studentCount={students.length}
        onOpenAddModal={handleOpenAddModal}
        onRefresh={() => loadStudents(false)}
        loading={loading}
      />

      <main className="main-content">
        <div className="container">
          <AlertBanner alert={alert} onDismiss={dismissAlert} />

          <StudentList
            students={students}
            loading={loading}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
          />
        </div>
      </main>

      {/* Form Modal (Add / Edit) */}
      <StudentForm
        isOpen={isFormOpen}
        student={editingStudent}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFormModal}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingStudent)}
        student={deletingStudent}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        isDeleting={isDeleting}
      />

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Student CRUD System &bull; Santos WMD3A</p>
      </footer>
    </div>
  );
}
