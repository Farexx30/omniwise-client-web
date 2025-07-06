import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type JSX } from "react";
import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import useQuery from '../../hooks/useQuery';
import { getEnrolledCourses } from '../../services/api';

export const Route = createFileRoute('/home/')({
    component: HomePage,
})

function HomePage() {
    const [searchValue, setSearchValue] = useState("");
    const { data: courses, loading, error, requeryFunction } = useQuery(getEnrolledCourses, true);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            await requeryFunction();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue.trim()]);

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
                {courses.map(c => (
                    <li key={c.id}>
                        <CourseCard {...c} />
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