package com.example.educationalqualityproject.e2e;

import com.example.educationalqualityproject.entity.Student;
import com.example.educationalqualityproject.repository.StudentRepository;
import com.example.educationalqualityproject.repository.TeacherRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StudentApiE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentRepository studentRepository;

    @MockBean
    private TeacherRepository teacherRepository;

    @BeforeEach
    void setUp() {
        reset(studentRepository, teacherRepository);
    }

    @Test
    @DisplayName("E2E API Student - GET /api/students retorna lista")
    void shouldReturnStudentsList() throws Exception {
        Student student = new Student("Pedro", "pedro@escola.edu", "R001");
        student.setId("s1");
        when(studentRepository.findAll()).thenReturn(List.of(student));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("s1"))
                .andExpect(jsonPath("$[0].name").value("Joao"));
    }

    @Test
    @DisplayName("E2E API Student - POST /api/students cria estudante")
    void shouldCreateStudent() throws Exception {
        Student request = new Student("Ana", "ana@escola.edu", "R002");
        Student saved = new Student("Ana", "ana@escola.edu", "R002");
        saved.setId("s2");

        when(studentRepository.existsByEmail("ana@escola.edu")).thenReturn(false);
        when(studentRepository.existsByRegistrationNumber("R002")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(saved);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("s2"))
                .andExpect(jsonPath("$.email").value("ana@escola.edu"));

        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("E2E API Student - POST /api/students retorna 409 para email duplicado")
    void shouldReturnConflictWhenEmailAlreadyExists() throws Exception {
        Student request = new Student("Ana", "ana@escola.edu", "R002");

        when(studentRepository.existsByEmail("ana@escola.edu")).thenReturn(true);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("E2E API Student - PUT /api/students/{id} retorna 404 quando nao existe")
    void shouldReturnNotFoundWhenUpdatingMissingStudent() throws Exception {
        Student request = new Student("Novo Nome", "novo@escola.edu", "R010");

        when(studentRepository.findById("missing")).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/students/missing")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("E2E API Student - DELETE /api/students/{id} remove estudante")
    void shouldDeleteStudent() throws Exception {
        Student student = new Student("Joao", "joao@escola.edu", "R001");
        student.setId("s1");
        when(studentRepository.findById("s1")).thenReturn(Optional.of(student));

        mockMvc.perform(delete("/api/students/s1"))
                .andExpect(status().isNoContent());

        verify(studentRepository, times(1)).deleteById("s1");
    }

    @Test
    @DisplayName("E2E API Student - GET /api/students retorna 200")
    void challengeTestShouldFailOnPurpose() throws Exception {
        Student student = new Student("Lia", "lia@escola.edu", "R777");
        student.setId("s777");
        when(studentRepository.findAll()).thenReturn(List.of(student));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk());
    }
}
