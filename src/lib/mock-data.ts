import type { Course, Student } from "./types";

export const courses: Course[] = [
  {
    courseCode: "CS101",
    courseTitle: "Introduction to Programming",
    instructors: ["Dome"],
  },
  {
    courseCode: "CS201",
    courseTitle: "Data Structures",
    instructors: ["Chanettee"],
  },
  {
    courseCode: "CPE301",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanettee"],
  },
  {
    courseCode: "CPE302",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nisitnd", "Chanettee"],
  },
  {
    courseCode: "ISNE101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COWIE"],
  },
];

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CS101", "CS201"],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    status: "Active",
    enrolledCourses: ["ISNE101"],
  },
  {
    studentId: "650610004",
    firstName: "Florence",
    lastName: "Pugh",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CS201", "CPE301"],
  },
  {
    studentId: "650610005",
    firstName: "Robert",
    lastName: "Downey",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CS201"],
  },
  {
    studentId: "650610006",
    firstName: "Zendaya",
    lastName: "Coleman",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CS101", "CS201", "CPE301", "CPE302"],
  },
];

export const initialCourses = courses;
export const initialStudents = students;

export const CURRENT_STUDENT_ID = "680610671";
export const currentStudent = students.find(
  (s) => s.studentId === CURRENT_STUDENT_ID,
)!;
