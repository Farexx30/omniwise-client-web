import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type JSX } from "react";
import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import { getEnrolledCourses } from '../../services/api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/home/')({
    component: HomePage,   
})

function HomePage() {
    const { data: courses, isLoading, isError } = useQuery({
        queryFn: getEnrolledCourses,
        queryKey: ["courses"]
    })

    const [searchValue, setSearchValue] = useState("");


    // useEffect(() => {
    //     const timeoutId = setTimeout(async () => {
    //         await requeryFunction();
    //     }, 500);

    //     return () => clearTimeout(timeoutId);
    // }, [searchValue.trim()]);

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
                        <CourseCard {...c} />
                    </li>
                ))}
            </ul>
        )
    }
    return (
        <div className="h-full w-full">
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