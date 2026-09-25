import { useState, useMemo } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export default function CoursesPage() {
  const { courses, addCourse, deleteCourse, removeInstructor } =
    useEnrollmentStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [instructorSearch, setInstructorSearch] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const allInstructors = useMemo(() => {
    const list = courses.flatMap((c) => c.instructors || []);
    return Array.from(new Set(list));
  }, [courses]);

  const isDuplicate = useMemo(() => {
    if (!courseCode.trim()) return false;
    return courses.some(
      (c) => c.courseCode.toLowerCase() === courseCode.trim().toLowerCase(),
    );
  }, [courseCode, courses]);

  const handleAddInstructor = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !selectedInstructors.includes(trimmed)) {
      setSelectedInstructors([...selectedInstructors, trimmed]);
    }
    setInstructorSearch("");
    setComboboxOpen(false);
  };

  const handleRemoveSelectedInstructor = (name: string) => {
    setSelectedInstructors(selectedInstructors.filter((inst) => inst !== name));
  };

  const handleSave = () => {
    if (!courseCode.trim() || !courseName.trim() || isDuplicate) return;

    addCourse({
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseName.trim(),
      instructors: selectedInstructors,
    });

    setCourseCode("");
    setCourseName("");
    setSelectedInstructors([]);
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            จัดการข้อมูลวิชาเรียนและอาจารย์ผู้สอน
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-1.5 h-4 w-4" />
            เพิ่มวิชา
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">รหัสวิชา</Label>
                <Input
                  id="code"
                  placeholder="เช่น CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  aria-invalid={isDuplicate}
                  className={
                    isDuplicate
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {isDuplicate && (
                  <p className="text-xs font-medium text-destructive">
                    มีรหัสวิชา {courseCode.toUpperCase()} นี้แล้ว
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">ชื่อวิชา</Label>
                <Input
                  id="name"
                  placeholder="เช่น Introduction to Programming"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>ผู้สอน</Label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger
                    render={
                      <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm cursor-pointer" />
                    }
                  >
                    <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm cursor-pointer">
                      {selectedInstructors.map((inst) => (
                        <Badge
                          key={inst}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {inst}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSelectedInstructor(inst);
                            }}
                            className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <span className="text-muted-foreground text-xs">
                        {selectedInstructors.length === 0
                          ? "ค้นหาหรือเพิ่มผู้สอน..."
                          : ""}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="พิมพ์ชื่ออาจารย์..."
                        value={instructorSearch}
                        onValueChange={setInstructorSearch}
                      />
                      <CommandList>
                        <CommandEmpty className="p-2">
                          {instructorSearch.trim() && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-xs font-normal"
                              onClick={() =>
                                handleAddInstructor(instructorSearch)
                              }
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" />+ เพิ่มผู้สอน
                              &quot;{instructorSearch}&quot;
                            </Button>
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {allInstructors
                            .filter(
                              (inst) => !selectedInstructors.includes(inst),
                            )
                            .map((inst) => (
                              <CommandItem
                                key={inst}
                                onSelect={() => handleAddInstructor(inst)}
                              >
                                {inst}
                              </CommandItem>
                            ))}
                          {instructorSearch.trim() &&
                            !allInstructors.some(
                              (i) =>
                                i.toLowerCase() ===
                                instructorSearch.trim().toLowerCase(),
                            ) &&
                            !selectedInstructors.includes(
                              instructorSearch.trim(),
                            ) && (
                              <CommandItem
                                onSelect={() =>
                                  handleAddInstructor(instructorSearch)
                                }
                                className="text-primary font-medium"
                              >
                                + เพิ่มผู้สอน &quot;{instructorSearch.trim()}
                                &quot;
                              </CommandItem>
                            )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleSave}
                disabled={
                  !courseCode.trim() || !courseName.trim() || isDuplicate
                }
              >
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="w-[80px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.courseCode}>
                <TableCell className="font-semibold">
                  {course.courseCode}
                </TableCell>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {course.instructors && course.instructors.length > 0 ? (
                      course.instructors.map((inst) => (
                        <Badge
                          key={inst}
                          variant="outline"
                          className="border-blue-400/60 bg-blue-50/60 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400 gap-1.5 py-0.5 px-2 font-normal rounded-md"
                        >
                          <span>{inst}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeInstructor(course.courseCode, inst)
                            }
                            className="rounded-full hover:bg-blue-200/50 dark:hover:bg-blue-800/50 p-0.5 text-blue-600 dark:text-blue-400 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        ยังไม่มีผู้สอน
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 transition-colors"
                        />
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบวิชา?</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณแน่ใจหรือไม่ว่าต้องการลบวิชา {course.courseCode} (
                          {course.courseTitle})?
                          การกระทำนี้จะลบการลงทะเบียนวิชานี้ของนักศึกษาทุกคนด้วย
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteCourse(course.courseCode)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          ลบวิชา
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
