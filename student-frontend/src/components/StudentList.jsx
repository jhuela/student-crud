import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Users, GraduationCap, X, UserX } from 'lucide-react';

export default function StudentList({
  students,
  loading,
  onEdit,
  onDelete,
  onOpenAddModal,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter((student) => {
      const idMatch = String(student.id).includes(term);
      const firstMatch = (student.firstname || '').toLowerCase().includes(term);
      const lastMatch = (student.lastname || '').toLowerCase().includes(term);
      const courseMatch = (student.course || '').toLowerCase().includes(term);
      const sectionMatch = (student.section || '').toLowerCase().includes(term);
      const fullMatch = `${student.firstname || ''} ${student.lastname || ''}`.toLowerCase().includes(term);
      return idMatch || firstMatch || lastMatch || courseMatch || sectionMatch || fullMatch;
    });
  }, [students, searchTerm]);

  return (
    <section className="student-list-section">
      {/* Search and summary control bar */}
      <div className="list-controls-card">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, ID, course, or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="stats-badge">
          <Users size={16} />
          <span>
            {students.length} Total Student{students.length === 1 ? '' : 's'}
            {searchTerm && ` (${filteredStudents.length} matching)`}
          </span>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="table-card">
        {loading && students.length === 0 ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading students from backend...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-circle">
              <GraduationCap size={36} />
            </div>
            <h3>No Students Found</h3>
            <p>Your database doesn't have any student records yet.</p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onOpenAddModal}
            >
              Add Your First Student
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-circle">
              <UserX size={36} />
            </div>
            <h3>No Matching Records</h3>
            <p>No student matches the search term "{searchTerm}".</p>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="id-badge">#{student.id}</span>
                    </td>
                    <td className="font-semibold">{student.firstname}</td>
                    <td className="font-semibold">{student.lastname}</td>
                    <td>
                      <span className="course-pill">{student.course}</span>
                    </td>
                    <td>
                      <span className="section-pill">{student.section}</span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={() => onEdit(student)}
                          title={`Edit ${student.firstname} ${student.lastname}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => onDelete(student)}
                          title={`Delete ${student.firstname} ${student.lastname}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
