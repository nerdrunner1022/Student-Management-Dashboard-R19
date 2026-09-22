import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBookOpen, faPlus, faUserCheck, faUserClock, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import AddStudentForm from "./components/AddStudentForm";
import StudentCard from "./components/StudentCard";
import { createStudent, deleteStudent, fetchStudents, updateStudentStatus } from "./api/studentApi";

function gpaParams(bucket) {
  switch (bucket) {
    case "3.5 and above":
      return { minGpa: 3.5 };
    case "3.0 - 3.49":
      return { minGpa: 3.0, maxGpa: 3.5 };
    case "Below 3.0":
      return { maxGpa: 3.0 };
    default:
      return {};
  }
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [gpaFilter, setGpaFilter] = useState("Any GPA");
  const [statusFilter, setStatusFilter] = useState("Any status");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isAllStudentsOpen, setIsAllStudentsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buildParams = useCallback(() => ({
    q: searchTerm.trim() || undefined,
    course: courseFilter === "All courses" ? undefined : courseFilter,
    status: statusFilter === "Any status" ? undefined : statusFilter,
    ...gpaParams(gpaFilter),
  }), [searchTerm, courseFilter, gpaFilter, statusFilter]);

  const refresh = useCallback(async () => {
    try {
      const [filtered, all] = await Promise.all([
        fetchStudents(buildParams()),
        fetchStudents(),
      ]);
      setStudents(filtered);
      setAllStudents(all);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load students.");
    }
  }, [buildParams]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await fetchStudents(buildParams());
        if (!cancelled) {
          setStudents(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load students.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [buildParams]);

  useEffect(() => {
    fetchStudents()
      .then(setAllStudents)
      .catch(err => setError(err.message || "Failed to load students."));
  }, []);

  const handleAddStudent = async (newStudent) => {
    try {
      await createStudent({
        name: newStudent.name,
        email: newStudent.email,
        course: newStudent.course,
        gpa: newStudent.gpa,
        status: newStudent.status,
      });
      setIsAddFormOpen(false);
      await refresh();
      toast.success("Student added to records");
    } catch (err) {
      setError(err.message || "Failed to add student.");
      toast.error(err.message || "Failed to add student.");
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      if (selectedStudentId === id) {
        setSelectedStudentId(null);
      }
      await refresh();
      toast.success("Student removed from records");
    } catch (err) {
      setError(err.message || "Failed to delete student.");
      toast.error(err.message || "Failed to delete student.");
    }
  };

  const handleToggleStatus = async (id) => {
    const student = students.find(s => s.id === id) ?? allStudents.find(s => s.id === id);
    if (!student) return;
    const target = student.status === "Active" ? "Suspended" : "Active";
    try {
      await updateStudentStatus(id, target);
      await refresh();
      toast.success(`Student ${target}`);
    } catch (err) {
      setError(err.message || "Failed to update status.");
      toast.error(err.message || "Failed to update status.");
    }
  };

  const courses = [...new Set(allStudents.map(student => student.course))].sort();
  const filteredStudents = students;
  const previewStudents = filteredStudents.slice(0, 6);
  const selectedStudent = filteredStudents.find(student => student.id === selectedStudentId);
  const activeStudents = allStudents.filter(student => student.status === "Active").length;
  const suspendedStudents = allStudents.filter(student => student.status === "Suspended").length;

  const renderStudentCard = (student) => (
    <StudentCard
      key={student.id}
      {...student}
      onDelete={() => handleDeleteStudent(student.id)}
      onToggleStatus={() => handleToggleStatus(student.id)}
    />
  );

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-black antialiased pb-12">
      <Header />
      <main className="box-border flex-1 w-full px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#17324d]"
            aria-label="Filter by course"
          >
            <option>All courses</option>
            {courses.map(course => <option key={course}>{course}</option>)}
          </select>
          <select
            value={gpaFilter}
            onChange={e => setGpaFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#17324d]"
            aria-label="Filter by GPA"
          >
            <option>Any GPA</option>
            <option>3.5 and above</option>
            <option>3.0 - 3.49</option>
            <option>Below 3.0</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#17324d]"
            aria-label="Filter by status"
          >
            <option>Any status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
          <button
            type="button"
            onClick={() => setIsAddFormOpen(true)}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#17324d] px-5 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#244d70] focus:outline-none focus:ring-2 focus:ring-[#17324d]"
          >
            <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
            Add student
          </button>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#17324d]">
              <span className="text-sm font-semibold">Total students</span>
              <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-black">{allStudents.length}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-green-700">
              <span className="text-sm font-semibold">Active students</span>
              <FontAwesomeIcon icon={faUserCheck} aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-green-800">{activeStudents}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-red-700">
              <span className="text-sm font-semibold">Suspended students</span>
              <FontAwesomeIcon icon={faUserClock} aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-red-800">{suspendedStudents}</p>
          </div>
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#17324d]">
              <span className="text-sm font-semibold">Courses</span>
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-black">{courses.length}</p>
          </div>
        </div>
        {loading && filteredStudents.length === 0 ? (
          <div className="rounded-xl border border-slate-300 bg-white p-12 text-center">
            <p className="text-sm text-black">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-xl border border-slate-300 bg-white p-12 text-center">
            <p className="text-sm text-black">No student records match your query.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                Showing {previewStudents.length} of {filteredStudents.length} students
              </p>
              {filteredStudents.length > previewStudents.length && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentId(null);
                    setIsAllStudentsOpen(true);
                  }}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-[#17324d] px-4 py-2 text-sm font-bold text-[#17324d] transition-colors hover:bg-[#17324d] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#17324d]"
                >
                  <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
                  View all students
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {previewStudents.map(renderStudentCard)}
            </div>
          </>
        )}
      </main>
      {isAllStudentsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#17324d]/80 px-4 py-6">
          <div className="relative max-h-full w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-300 bg-[#f8f7f2] p-5 shadow-xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {selectedStudent ? selectedStudent.name : "All students"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedStudent ? selectedStudent.course : `${filteredStudents.length} matching student records`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {selectedStudent && (
                  <button
                    type="button"
                    onClick={() => setSelectedStudentId(null)}
                    className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#17324d] transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17324d]"
                    aria-label="Back to student list"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsAllStudentsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition-colors hover:bg-slate-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#17324d]"
                  aria-label="Close all students panel"
                  title="Close"
                >
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                </button>
              </div>
            </div>
            {!selectedStudent ? (
              <div className="space-y-2" role="list" aria-label="Student records">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudentId(student.id)}
                    className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left text-black transition-colors hover:border-[#17324d] focus:outline-none focus:ring-2 focus:ring-[#17324d]"
                    role="listitem"
                  >
                    <span>
                      <span className="block font-bold">{student.name}</span>
                      <span className="mt-1 block text-xs text-slate-500">{student.course}</span>
                    </span>
                    <span className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
                      student.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {student.status}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              renderStudentCard({ ...selectedStudent, alwaysShowDetails: true })
            )}
          </div>
        </div>
      )}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324d]/80 px-4 py-6">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="absolute right-3 top-3 z-10 text-2xl leading-none text-slate-500 hover:text-black"
              aria-label="Close add student form"
              title="Close"
            >
              ×
            </button>
            <AddStudentForm onAddStudent={handleAddStudent} />
          </div>
        </div>
      )}
    </div>
  );
}