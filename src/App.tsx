import './App.css'
import Sidebar from './components/Sidebar';
import WebHeader from './components/WebHeader';
import CourseBar from './components/CourseBar';

function App() {

  return (
    <main>
      <div className="bg-main-page w-screen h-screen bg-center bg-cover fixed inset-0 z-0 overflow-hidden flex flex-col">
        
        <WebHeader />
        <div className="flex flex-row h-[calc(100vh-2rem)] w-full">
          <Sidebar />
          <CourseBar />
        </div>
      </div>  
    </main>
  )
}

export default App
