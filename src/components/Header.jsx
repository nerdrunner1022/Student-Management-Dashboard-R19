import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);

  return (
        <header className="relative flex items-center justify-between border-b border-[#244d70] bg-[#17324d] px-6 py-6 text-left">
      <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
        <span>Student Management Dashboard</span>
      </h1>
      <div className="relative ml-4 shrink-0">
        <button
          type="button"
          onClick={() => setIsAccountPanelOpen(prev => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-xl text-white transition-colors hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Open account panel"
          aria-expanded={isAccountPanelOpen}
          title="Account"
        >
          <FontAwesomeIcon icon={faUser} aria-hidden="true" />
        </button>
        {isAccountPanelOpen && (
          <section className="absolute right-0 top-14 z-20 w-72 rounded-xl border border-slate-200 bg-white p-5 text-black shadow-xl" aria-label="Account information">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17324d] text-lg text-white">
                <FontAwesomeIcon icon={faUser} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-black">Alex Morgan</h2>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <dl className="space-y-3 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="text-right font-medium">alex.morgan@example.com</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Status</dt>
                <dd className="font-semibold text-green-700">Active</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
        </header>
  );
}
