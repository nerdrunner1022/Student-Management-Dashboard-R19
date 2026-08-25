import { useState } from 'react';
import PropTypes from 'prop-types';

export default function StudentCard({ name, email, course, gpa, status, onDelete, onToggleStatus }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-indigo-400 text-xs font-semibold">{course}</p>
        </div>
        <span className={`px-2.5 py-1 text-[14px] font-extrabold rounded-full border ${
          status === "Active"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
        }`}>
          {status}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50">
        <span className="text-xs text-slate-400">Current GPA</span>
        <span className="text-emerald-400 font-bold text-sm">{gpa}</span>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-xs text-slate-300 transition-all duration-300">
          <p><strong className="text-slate-400">Email:</strong> {email}</p>
          <div className="flex gap-2 pt-2">
            <button onClick={onToggleStatus} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-1.5 px-3 rounded text-[11px] transition-colors cursor-pointer">Toggle Status</button>
            <button onClick={onDelete} className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-red-500/20 transition-all duration-300 cursor-pointer">Delete Student</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsExpanded(prev => !prev)} className="mt-4 w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer">
        {isExpanded ? "Hide Details" : "Show Details"}
      </button>
    </div>
  );
}

StudentCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  gpa: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired
};