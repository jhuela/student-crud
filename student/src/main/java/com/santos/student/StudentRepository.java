package com.santos.student;

import org.springframework.data.repository.CrudRepository;

public interface StudentRepository extends CrudRepository<com.santos.student.Student, Integer> {
}