import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState, type JSX } from 'react';
import ConditionalWrapper from '../../components/ConditionalWrapper';
import CourseCard from '../../components/CourseCard';
import LoadingView from '../../components/LoadingView';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import { useDebounce } from '../../hooks/useDebounce';
import { enrollInCourse, getAvailableCourses } from '../../services/api';


export const Route = createFileRoute('/home/available-courses')({
    component: AvailableCourses,
})

function AvailableCourses() {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue.trim(), 500);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

    const { data: courses, isLoading, error } = useQuery({
        queryFn: () => getAvailableCourses(searchValue),
        queryKey: ["courses", "pending", { debouncedSearchValue }]
    })

    const queryClient = useQueryClient();

    const { mutateAsync: enroll } = useMutation({
        mutationFn: enrollInCourse,
        onSuccess: async () => {
            alert("Successfully enrolled!");
            await queryClient.invalidateQueries({ queryKey: ["courses"] });
            setIsSubmitting(false);
        },
        onError: (error) => {
            setIsSubmitting(false);
            alert(error instanceof Error
                ? error.message || "Unknown error"
                : new Error("An unexpected error occurred")
            );
        }
    });

    let content: JSX.Element | null = null;

    if (isLoading) {
        content = (
            <section className="flex h-full items-center justify-center">
                <Spinner />
            </section>
        );
    }
    else if (error) {
        content = <p className="text-red-500 font-bold text-center text-xl mt-8">Error - {error.message}</p>;
    }
    else if (!courses || courses.length === 0) {
        content = <p className="text-white text-center text-xl mt-8 italic">No courses found.</p>;
    }
    else {
        content = (
            <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 p-4">
                {courses.map(c => (
                    <li key={c.id}>
                        <CourseCard
                            {...c}
                            disableControls={isSubmitting}
                            onEnroll={async () => {
                                setIsSubmitting(true);
                                await enroll(c.id)
                            }}
                        />
                    </li>
                ))}
            </ul>
        )
    }
    return (
        isSubmittingDebounced && isSubmitting ? (
            <LoadingView />
        ) : (
            <div className="h-full w-full flex flex-col">
                <SearchBar
                    searchValue={searchValue}
                    onSearch={setSearchValue}
                    placeholder="Search for courses..."
                />
                <ConditionalWrapper
                    condition={!isLoading}
                    wrapper={(children) => <section className="space-y-9">{children}</section>}
                >
                    {content}
                </ConditionalWrapper>
            </div>
        )
    )
}


export default AvailableCourses