import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState, type JSX } from "react";
import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import { getEnrolledCourses } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { HomeContext } from './route';

export const Route = createFileRoute('/home/')({
    component: HomePage
})

function HomePage() {
    const homeContext = useContext(HomeContext);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue.trim(), 500);

    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ["courses", { debouncedSearchValue }],
        queryFn: () => getEnrolledCourses(searchValue)
    })

    let content: JSX.Element | null = null;
    if (isLoading) {
        content = <Spinner />;
    }
    else if (isError) {
        content = <p className="text-red-500">Error.</p>;
    }
    else if (!courses || courses.length === 0) {
        content = <p>No courses found.</p>;
    }
    else {
        content = (
            <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3">
                {courses.map(c => (
                    <li key={c.id}>
                        <CourseCard 
                        {...c}
                        onClick={() => {
                            homeContext?.setCurrentCourseId(c.id);
                            homeContext?.setCurrentCourseName(c.name);
                        }} />
                    </li>
                ))}
            </ul>
        )
    }
    return (
        <div className="bg-red h-full w-full">
            <SearchBar
                searchValue={searchValue}
                onSearch={setSearchValue}
                placeholder="Search for courses..."
            />
            <section className="space-y-9 mt-4">
                {content}
            </section>
        </div>
    )
}

export default HomePage