import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
  { id: 8, name: "Pearl Krabs", email: "pearl@money.com", course: "Marine Economics", gpa: 3.6, status: "Active" },
  { id: 9, name: "Larry Lobster", email: "larry@fitness.edu", course: "Kinesiology", gpa: 3.2, status: "Active" },
  { id: 10, name: "Karen Plankton", email: "karen@evil.com", course: "Computer Science", gpa: 4.0, status: "Active" },
  { id: 11, name: "Bubble Bass", email: "bubblebass@food.edu", course: "Culinary Arts", gpa: 2.4, status: "Suspended" },
  { id: 12, name: "Mermaid Man", email: "merman@heroism.edu", course: "Heroic Studies", gpa: 3.1, status: "Active" },
  { id: 13, name: "Barnacle Boy", email: "barnacleboy@heroism.edu", course: "Emergency Response", gpa: 3.5, status: "Active" },
  { id: 14, name: "Squilliam Fancyson", email: "squilliam@music.edu", course: "Music Performance", gpa: 3.9, status: "Active" }
];

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

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

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased pb-12">
      <Header />
      <main className="w-[90vw] max-w-6xl mx-auto mt-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {filteredStudents.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-slate-400 text-sm">No student records match your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                {...student}
                onDelete={() => handleDeleteStudent(student.id)}
                onToggleStatus={() => handleToggleStatus(student.id)}
              />
            ))}
          </div>
        )}
      </main>
      <button
        type="button"
        onClick={() => setIsAddFormOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-3xl leading-none text-white shadow-lg transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Add student"
        title="Add student"
      >
        <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
      </button>
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="absolute right-3 top-3 z-10 text-2xl leading-none text-slate-400 hover:text-white"
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