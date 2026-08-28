import { useState } from 'react';
import PropTypes from 'prop-types';

export default function StudentCard({ name, email, course, gpa, status, onDelete, onToggleStatus, alwaysShowDetails = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const surname = nameParts.slice(1).join(" ");

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 text-black shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="mb-1 text-xl font-bold text-black">
            <span className="block">{firstName}</span>
            {surname && <span className="block">{surname}</span>}
          </h3>
          <p className="text-xs font-semibold text-[#17324d]">{course}</p>
        </div>
        <span className={`px-2.5 py-1 text-[14px] font-extrabold rounded-full border ${
          status === "Active"
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-[#f8f7f2] px-3 py-2">
        <span className="text-xs text-slate-600">Current GPA</span>
        <span className="text-sm font-bold text-black">{gpa}</span>
      </div>
      {(isExpanded || alwaysShowDetails) && (
        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs text-black transition-all duration-300">
          <p><strong className="text-slate-600">Email:</strong> {email}</p>
          <div className="flex gap-2 pt-2">
            <button onClick={onToggleStatus} className="flex-1 rounded bg-[#17324d] px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#244d70]">
              {status === "Active" ? "Suspend Student" : "Activate Student"}
            </button>
            <button onClick={onDelete} className="flex-1 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700 transition-all duration-300 hover:bg-red-600 hover:text-white">Delete Student</button>
          </div>
        </div>
      )}
      {!alwaysShowDetails && (
        <button onClick={() => setIsExpanded(prev => !prev)} className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-slate-200">
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      )}
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
  onToggleStatus: PropTypes.func.isRequired,
  alwaysShowDetails: PropTypes.bool
};