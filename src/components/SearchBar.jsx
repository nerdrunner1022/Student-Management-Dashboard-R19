import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search students by name or course..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Clear search"
          title="Clear search"
        >
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};