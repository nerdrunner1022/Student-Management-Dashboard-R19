import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBookOpen, faPlus, faUserCheck, faUserClock, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import AddStudentForm from "./components/AddStudentForm";
import StudentCard from "./components/StudentCard";

const INITIAL_STUDENTS = [
  { id: 1, name: "SpongeBob SquarePants", email: "spongebob@boating.edu", course: "Boating Safety", gpa: 2.1, status: "Active" },
  { id: 2, name: "Sandy Cheeks", email: "sandy@science.org", course: "Marine Biology", gpa: 4.0, status: "Active" },
  { id: 3, name: "Squidward Tentacles", email: "squidward@clarinet.net", course: "Classical Music", gpa: 3.4, status: "Suspended" },
  { id: 4, name: "Patrick Star", email: "patrick@rock.com", course: "Underwater Studies", gpa: 1.5, status: "Active" },
  { id: 5, name: "Mr. Krabs", email: "mrkrabs@money.com", course: "Business Management", gpa: 3.8, status: "Active" },
  { id: 6, name: "Plankton", email: "plankton@evil.com", course: "Chemistry", gpa: 2.8, status: "Suspended" },
  { id: 7, name: "Mrs. Puff", email: "mrspuff@boating.edu", course: "Driver Education", gpa: 3.9, status: "Active" },
  { id: 8, name: "Pearl Krabs", email: "pearl@money.com", course: "Marine Biology", gpa: 3.6, status: "Active" },
  { id: 9, name: "Larry Lobster", email: "larry@fitness.edu", course: "Kinesiology", gpa: 3.2, status: "Active" },
  { id: 10, name: "Karen Plankton", email: "karen@evil.com", course: "Computer Science", gpa: 4.0, status: "Active" },
  { id: 11, name: "Bubble Bass", email: "bubblebass@food.edu", course: "Culinary Arts", gpa: 2.4, status: "Suspended" },
  { id: 12, name: "Mermaid Man", email: "merman@heroism.edu", course: "Heroic Studies", gpa: 3.1, status: "Active" },
  { id: 13, name: "Barnacle Boy", email: "barnacleboy@heroism.edu", course: "Emergency Response", gpa: 3.5, status: "Active" },
  { id: 14, name: "Squilliam Fancyson", email: "squilliam@music.edu", course: "Classical Music", gpa: 3.9, status: "Active" }
];

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [gpaFilter, setGpaFilter] = useState("Any GPA");
  const [statusFilter, setStatusFilter] = useState("Any status");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isAllStudentsOpen, setIsAllStudentsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const handleAddStudent = (newStudent) => {
    setStudents(prevStudents => [...prevStudents, newStudent]);
    setIsAddFormOpen(false);
  };

  const handleDeleteStudent = (id) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
  };

  const handleToggleStatus = (id) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id
          ? { ...student, status: student.status === "Active" ? "Suspended" : "Active" }
          : student
      )
    );
  };

  const courses = [...new Set(students.map(student => student.course))].sort();
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === "All courses" || student.course === courseFilter;
    const matchesStatus = statusFilter === "Any status" || student.status === statusFilter;
    const matchesGpa =
      gpaFilter === "Any GPA" ||
      (gpaFilter === "3.5 and above" && student.gpa >= 3.5) ||
      (gpaFilter === "3.0 - 3.49" && student.gpa >= 3.0 && student.gpa < 3.5) ||
      (gpaFilter === "Below 3.0" && student.gpa < 3.0);

    return matchesSearch && matchesCourse && matchesStatus && matchesGpa;
  });
  const previewStudents = filteredStudents.slice(0, 6);
  const selectedStudent = filteredStudents.find(student => student.id === selectedStudentId);
  const activeStudents = students.filter(student => student.status === "Active").length;
  const suspendedStudents = students.filter(student => student.status === "Suspended").length;

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
            <p className="mt-3 text-3xl font-bold text-black">{students.length}</p>
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
        {filteredStudents.length === 0 ? (
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