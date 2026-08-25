# Student Management Dashboard

## Project Overview

Student Management Dashboard is a frontend React application for viewing and managing student records. It uses locally defined mock data, so it can be run without a database or API server.

Users can search students by name or course, expand a record to view its email address, toggle a student's active or suspended status, add a new student, and delete an existing record.

## Technologies Used

- React 19 for the user interface and component-based application structure
- Vite 8 for development, bundling, and the production build
- JavaScript with JSX
- Tailwind CSS 4 for styling and responsive layout
- Font Awesome for interface icons
- PropTypes for component prop validation
- ESLint for code-quality checks

## Application Type

This is a frontend-only application. There is currently no backend, database, API, authentication, or persistent storage. Student data is initialized from mock records and changes exist only for the current browser session.

## Running the Project

From this directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Available checks and build commands:

```bash
npm run lint
npm run build
```

## Requirements Audit

### Task Overview

| Requirement | Status | Evidence |
| --- | --- | --- |
| Build a student management dashboard using local or mock data | Satisfied | The dashboard renders mock records from `INITIAL_STUDENTS` in `src/App.jsx`. |
| Provide a clear way to view and manage student records | Satisfied | Student records are displayed as responsive cards with expandable details, status controls, and delete actions. |
| Include functionality for finding or narrowing down records | Satisfied | `SearchBar` filters records by student name or course and includes a clear-search control. |
| Allow users to add new student information | Satisfied | `AddStudentForm` opens from the floating add button and inserts a new active record. |
| Allow users to remove existing records | Satisfied | Each expanded `StudentCard` provides a delete action. |
| Handle input and common application states appropriately | Satisfied | Controlled form fields, validation errors, modal open/close state, empty search results, and expandable cards are handled. |

### Development Expectations

| Expectation | Status | Evidence |
| --- | --- | --- |
| Organize the app into reusable React components | Satisfied | The UI is separated into `Header`, `SearchBar`, `AddStudentForm`, and `StudentCard` components. |
| Use appropriate React concepts for data and interactions | Satisfied | `useState`, controlled inputs, props, callbacks, list rendering, and conditional rendering are used appropriately. |
| Keep the code readable and logically structured | Satisfied | State updates and UI responsibilities are kept in focused components with descriptive names. |
| Provide basic validation and clear feedback | Satisfied | Required fields, email format, and GPA range are validated with visible error messages. |

### Assessment Areas

| Area | Status | Audit |
| --- | --- | --- |
| React fundamentals | Satisfied | The app demonstrates components, JSX, state, props, event handlers, and conditional rendering. |
| Component design and reusability | Satisfied | Repeated student UI is represented by `StudentCard`, while form and search behavior are isolated. |
| State and data handling | Satisfied | Student data and UI state are managed in `App.jsx` using immutable state updates. |
| User interactions and event handling | Satisfied | Search, add, delete, expand/collapse, status toggling, and modal close actions work through event handlers. |
| Forms and basic validation | Satisfied | The add form validates required values, email presence of `@`, and GPA values from 0.0 to 4.0. |
| Search and filtering logic | Satisfied | Filtering is case-insensitive and checks both names and courses. |
| Conditional rendering and user feedback | Satisfied | The app shows validation errors, an empty-results message, expanded details, and the add form conditionally. |
| Code organization, readability, and problem-solving | Satisfied | The code is organized into small components and includes an ESLint script for quality checks. |

## Known Limitations

- Changes are not persisted after a page refresh because there is no backend or local storage.
- Email validation is intentionally basic and only checks for an `@` character.
- There are no automated tests included in this Vite project yet.
