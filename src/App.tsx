import { useState } from 'react';
import './App.css'
import SearchBar from './components/SearchBar'

function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <main>
      <div className="main-page-background" />
      
      <div className="px-5 py-12 xs:p-10 max-w-7xl mx-auto flex flex-col relative z-10">

        <header>
          <h1><span className="text-gradient">Omniwise</span></h1>
        </header>

        <SearchBar
          searchValue={searchValue}
          onSearch={setSearchValue}
          placeholder="Search for courses..."
        />

      </div>
    </main>
  )
}

export default App
