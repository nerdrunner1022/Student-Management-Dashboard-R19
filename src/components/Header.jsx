import React, { Component } from 'react'

class Header extends Component {
  render() {
    const currentYear = new Date().getFullYear();
    return (
        <header className="bg-slate-800 border-b border-slate-700 py-2 px-4 text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Student Management Dashboard</h1>
        {/* <p className="text-slate-400 text-xs mt-1">Copyright © {currentYear} . All Rights Reserved.</p> */}
        </header>
    );
  }
}

export default Header;
