import { useEffect, useState, type JSX } from 'react';
import './App.css'
import SearchBar from './components/SearchBar'
import { getAvailableCourses, getEnrolledCourses } from './services/api';
import useQuery from './hooks/useQuery';
import Spinner from './components/Spinner';
import CourseCard from './components/CourseCard';
import Sidebar from './components/Sidebar';
import WebHeader from './components/WebHeader';

function App() {

 return (
    <main>
      <div className="main-page-background">
        <WebHeader/>
        <Sidebar/>
      </div>
    </main>
  )
}

export default App
