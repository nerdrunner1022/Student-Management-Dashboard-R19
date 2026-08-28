import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative min-w-0 flex-1">
      <input
        type="text"
        placeholder="Search students by name or course..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#17324d]"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition-colors hover:text-black focus:outline-none focus:ring-2 focus:ring-[#17324d]"
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