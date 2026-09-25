import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  courses as initialCourses,
  students as initialStudents,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

export const STUDENT_ID = "680610671";

export interface EnrollmentStore {
  students: Student[];
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (courseCode: string) => void;
  removeInstructor: (courseCode: string, instructorName: string) => void;
  enrollStudents: (courseCode: string, studentIds: string[]) => void;
  dropStudent: (courseCode: string, studentId: string) => void;
}

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,

      addCourse: (newCourse) =>
        set((state) => ({
          courses: [...state.courses, newCourse],
        })),

      deleteCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          students: state.students.map((student) => ({
            ...student,
            enrolledCourses: student.enrolledCourses.filter(
              (code) => code !== courseCode,
            ),
          })),
        })),

      removeInstructor: (courseCode, instructorName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.courseCode === courseCode
              ? {
                  ...course,
                  instructors: course.instructors?.filter(
                    (inst) => inst !== instructorName,
                  ),
                }
              : course,
          ),
        })),

      enrollStudents: (courseCode, studentIds) =>
        set((state) => ({
          students: state.students.map((student) => {
            if (
              studentIds.includes(student.studentId) &&
              !student.enrolledCourses.includes(courseCode)
            ) {
              return {
                ...student,
                enrolledCourses: [...student.enrolledCourses, courseCode],
              };
            }
            return student;
          }),
        })),

      dropStudent: (courseCode, studentId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.studentId === studentId
              ? {
                  ...student,
                  enrolledCourses: student.enrolledCourses.filter(
                    (code) => code !== courseCode,
                  ),
                }
              : student,
          ),
        })),
    }),
    {
      name: `lab16-2569-${STUDENT_ID}`,
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);
