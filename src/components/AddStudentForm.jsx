import { useState } from 'react';
import PropTypes from 'prop-types';

export default function AddStudentForm({ onAddStudent }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [gpa, setGpa] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !course.trim() || !gpa.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const parsedGpa = parseFloat(gpa);
    if (isNaN(parsedGpa) || parsedGpa < 0 || parsedGpa > 4) {
      setError("GPA must be a number between 0.0 and 4.0.");
      return;
    }
    setError("");
    onAddStudent({ id: Date.now(), name: name.trim(), email: email.trim(), course: course.trim(), gpa: parsedGpa, status: "Active" });
    setName("");
    setEmail("");
    setCourse("");
    setGpa("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-bold text-white mb-4">Register New Student</h3>
      {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-xs mb-4">{error}</div>}
      <div className="space-y-4">
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="text" placeholder="Registered Course" value={course} onChange={e => setCourse(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="number" step="0.1" placeholder="GPA (0.0 - 4.0)" value={gpa} onChange={e => setGpa(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Add Student Record</button>
      </div>
    </form>
  );
}

AddStudentForm.propTypes = {
  onAddStudent: PropTypes.func.isRequired
};