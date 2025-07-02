import { useState, type JSX } from 'react';
import './App.css'
import SearchBar from './components/SearchBar'
import { getEnrolledCourses } from './services/api';
import useQuery from './hooks/useQuery';
import Spinner from './components/Spinner';

function App() {
  const [searchValue, setSearchValue] = useState("");
  const { data: courses, loading, error } = useQuery(getEnrolledCourses, true);

  let content: JSX.Element | null = null;

  if (loading) {
    content = <Spinner />;
  }
  else if (error) {
    content = <p className="text-red-500">Error: {error.message}</p>;
  }
  else if (!courses || courses.length === 0) {
    content = <p>No courses found.</p>;
  }
  else {
    content = (
      <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3">
        {courses.map(course => (
          <li key={course.id}>
            <img src={course.imgUrl || '/search-icon.svg'} alt={course.name} />
            <h3>{course.name}</h3>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <main>
      <div className="main-page-background" />

      <div className="px-5 py-12 xs:p-10 max-w-7xl mx-auto flex flex-col relative z-10">
        <header>
          <h1>
            <span className="text-gradient">Omniwise</span>
          </h1>
          <SearchBar
            searchValue={searchValue}
            onSearch={setSearchValue}
            placeholder="Search for courses..."
          />
        </header>
        <section className="space-y-9">
          <h2 className="mt-[20px]">Enrolled courses</h2>
          {content}
        </section>
      </div>
    </main>
  )
}

export default App
