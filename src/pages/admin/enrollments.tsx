// src/pages/admin/enrollments.tsx
import { useState, useMemo } from "react";
import { Check, PlusCircle, X } from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function EnrollmentsPage() {
  const { courses, students, enrollStudents, dropStudent } =
    useEnrollmentStore();

  // แท็บค้นหา: "course" | "student"
  const [searchMode, setSearchMode] = useState<"course" | "student">("course");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [studentFilter, setStudentFilter] = useState<string>("all");

  // State สำหรับ Dialog ลงทะเบียน
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // กรองรายวิชาที่จะนำมาแสดงในตาราง (คงรูปแบบ 1 แถวต่อ 1 วิชา เสมอ)
  const displayedCourses = useMemo(() => {
    if (searchMode === "course") {
      if (courseFilter === "all") return courses;
      return courses.filter((c) => c.courseCode === courseFilter);
    } else {
      // เมื่อค้นหาตามนักศึกษา
      if (studentFilter === "all") return courses;
      const targetStudent = students.find((s) => s.studentId === studentFilter);
      if (!targetStudent) return courses;
      // แสดงเฉพาะวิชาที่นักศึกษาคนนี้ลงทะเบียนไว้
      return courses.filter((c) =>
        targetStudent.enrolledCourses.includes(c.courseCode),
      );
    }
  }, [courses, students, searchMode, courseFilter, studentFilter]);

  // นักศึกษาที่ยังไม่ได้ลงในวิชาที่เลือก (ใช้ใน Dialog)
  const availableStudents = useMemo(() => {
    if (!selectedCourse) return [];
    return students.filter((s) => !s.enrolledCourses.includes(selectedCourse));
  }, [students, selectedCourse]);

  const toggleStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(
        selectedStudentIds.filter((id) => id !== studentId),
      );
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleEnroll = () => {
    if (!selectedCourse || selectedStudentIds.length === 0) return;
    enrollStudents(selectedCourse, selectedStudentIds);
    setOpenDialog(false);
    setSelectedCourse("");
    setSelectedStudentIds([]);
  };

  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          จัดการการลงทะเบียน
        </h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      {/* ปุ่มเปิด Dialog ลงทะเบียน */}
      <div>
        <Button
          onClick={() => setOpenDialog(true)}
          variant="outline"
          className="bg-card hover:bg-accent text-foreground gap-2 rounded-full border shadow-sm px-4"
        >
          <PlusCircle className="h-4 w-4" />
          ลงทะเบียนให้นักศึกษา
        </Button>
      </div>

      {/* แท็บสลับ ค้นหาตามวิชา / ค้นหาตามนักศึกษา */}
      <div className="space-y-3">
        <div className="flex w-fit rounded-lg bg-muted/60 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setSearchMode("course")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              searchMode === "course"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ค้นหาตามวิชา
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("student")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              searchMode === "student"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ค้นหาตามนักศึกษา
          </button>
        </div>

        {/* 1. Dropdown ค้นหาตามวิชา */}
        {searchMode === "course" && (
          <div className="w-full">
            <Select
              value={courseFilter}
              onValueChange={(val) => setCourseFilter(val ?? "all")}
            >
              <SelectTrigger className="w-full bg-card border">
                <SelectValue placeholder="ทุกวิชา">
                  {courseFilter === "all"
                    ? "ทุกวิชา"
                    : (() => {
                        const c = courses.find(
                          (item) => item.courseCode === courseFilter,
                        );
                        return c
                          ? `${c.courseCode} — ${c.courseTitle || (c as any).courseTitle}`
                          : courseFilter;
                      })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent style={{ width: "var(--anchor-width)" }}>
                <SelectItem value="all">ทุกวิชา</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.courseCode} value={course.courseCode}>
                    {course.courseCode} —{" "}
                    {course.courseTitle || (course as any).courseTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 2. Dropdown ค้นหาตามนักศึกษา */}
        {searchMode === "student" && (
          <div className="w-full">
            <Select
              value={studentFilter}
              onValueChange={(val) => setStudentFilter(val ?? "all")}
            >
              <SelectTrigger className="w-full bg-card border">
                <SelectValue placeholder="ทุกคน">
                  {studentFilter === "all"
                    ? "ทุกคน"
                    : (() => {
                        const s = students.find(
                          (item) => item.studentId === studentFilter,
                        );
                        return s
                          ? `${s.studentId} — ${s.firstName} ${s.lastName}`
                          : studentFilter;
                      })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent style={{ width: "var(--anchor-width)" }}>
                <SelectItem value="all">ทุกคน</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId}>
                    {student.studentId} — {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* ตารางแสดงผลรายวิชา (1 แถวต่อ 1 วิชา เสมอ) */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead className="w-[120px] text-center">จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCourses.length > 0 ? (
              displayedCourses.map((course) => {
                const enrolledInThisCourse = students.filter((s) =>
                  s.enrolledCourses.includes(course.courseCode),
                );

                return (
                  <TableRow key={course.courseCode}>
                    <TableCell className="font-semibold">
                      {course.courseCode}
                    </TableCell>
                    <TableCell>
                      {course.courseTitle || (course as any).courseTitle}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {enrolledInThisCourse.length}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {enrolledInThisCourse.length > 0 ? (
                          enrolledInThisCourse.map((st) => (
                            <Badge
                              key={st.studentId}
                              variant="outline"
                              className="border-blue-400/60 bg-blue-50/60 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400 gap-1.5 py-0.5 px-2 font-normal rounded-md"
                            >
                              <span>
                                {st.firstName} {st.lastName}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  dropStudent(course.courseCode, st.studentId)
                                }
                                className="rounded-full hover:bg-blue-200/50 dark:hover:bg-blue-800/50 p-0.5 text-blue-600 dark:text-blue-400 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  ไม่พบวิชาที่ลงทะเบียน
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog ลงทะเบียนให้นักศึกษา */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            <DialogDescription>
              เลือกวิชาก่อน แล้วจึงเลือกนักศึกษาที่ต้องการลงทะเบียน
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">วิชา</label>
              <Select
                value={selectedCourse}
                onValueChange={(val) => {
                  setSelectedCourse(val ?? "");
                  setSelectedStudentIds([]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- เลือกวิชา --" />
                </SelectTrigger>
                <SelectContent style={{ width: "var(--anchor-width)" }}>
                  {courses.map((course) => (
                    <SelectItem
                      key={course.courseCode}
                      value={course.courseCode}
                    >
                      {course.courseCode} -{" "}
                      {course.courseName || (course as any).courseTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">นักศึกษา</label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger
                  render={
                    <div
                      className={`flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm ${
                        !selectedCourse
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    />
                  }
                >
                  {selectedStudentIds.map((id) => {
                    const st = students.find((s) => s.studentId === id);
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {st?.firstName} {st?.lastName}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStudent(id);
                          }}
                          className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  <span className="text-muted-foreground text-xs">
                    {!selectedCourse
                      ? "กรุณาเลือกวิชาก่อน"
                      : selectedStudentIds.length === 0
                        ? "ค้นหาและเลือกนักศึกษา..."
                        : ""}
                  </span>
                </PopoverTrigger>
                {selectedCourse && (
                  <PopoverContent className="w-[380px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="พิมพ์รหัสหรือชื่อนักศึกษา..." />
                      <CommandList>
                        <CommandEmpty>
                          ไม่พบนักศึกษาที่ยังไม่ได้ลงวิชานี้
                        </CommandEmpty>
                        <CommandGroup>
                          {availableStudents.map((st) => {
                            const isChecked = selectedStudentIds.includes(
                              st.studentId,
                            );
                            return (
                              <CommandItem
                                key={st.studentId}
                                onSelect={() => toggleStudent(st.studentId)}
                                className="flex items-center justify-between"
                              >
                                <span>
                                  {st.studentId} — {st.firstName} {st.lastName}
                                </span>
                                {isChecked && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleEnroll}
              disabled={!selectedCourse || selectedStudentIds.length === 0}
            >
              ลงทะเบียน ({selectedStudentIds.length} คน)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
