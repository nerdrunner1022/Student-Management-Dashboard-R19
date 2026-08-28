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
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-300 bg-white p-6 text-black shadow-md">
      <h3 className="mb-4 text-lg font-bold text-black">Register New Student</h3>
      {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700">{error}</div>}
      <div className="space-y-4">
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-[#f8f7f2] px-4 py-2.5 text-sm text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#17324d]" />
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-[#f8f7f2] px-4 py-2.5 text-sm text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#17324d]" />
        <input type="text" placeholder="Registered Course" value={course} onChange={e => setCourse(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-[#f8f7f2] px-4 py-2.5 text-sm text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#17324d]" />
        <input type="number" step="0.1" placeholder="GPA (0.0 - 4.0)" value={gpa} onChange={e => setGpa(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-[#f8f7f2] px-4 py-2.5 text-sm text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#17324d]" />
        <button type="submit" className="w-full rounded-lg bg-[#17324d] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#244d70]">Add Student Record</button>
      </div>
    </form>
  );
}

AddStudentForm.propTypes = {
  onAddStudent: PropTypes.func.isRequired
};