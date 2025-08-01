import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useContext, useState, type JSX } from "react";
import ConditionalWrapper from '../../components/ConditionalWrapper';
import CourseCard from '../../components/CourseCard';
import LoadingView from '../../components/LoadingView';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import TransparentButton from '../../components/TransparentButton';
import { useDebounce } from '../../hooks/useDebounce';
import { deleteUser, getEnrolledCourses, getUsersByStatus, updateUserStatus } from '../../services/api';
import type { UserStatus } from '../../types/user';
import { HomeContext, UserContext } from './route';
import UserArchive from "/archive.svg";
import UndoArchive from "/undo-archive.svg";
import UserAccept from "/user-accept.svg";
import UserDelete from "/user-delete.svg";

export const Route = createFileRoute('/home/')({
    component: HomePage
})

type UpdateStatusMutationVariables = {
    userId: string;
    statusIndex: number;
}

function HomePage() {
    const queryClient = useQueryClient();
    const { role: currentUserRole } = useContext(UserContext)!;
    const homeContext = useContext(HomeContext);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue.trim(), 500);

    const [currentAdminTab, setCurrentAdminTab] = useState<UserStatus>("Pending")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

    const adminTabs: UserStatus[] = ["Pending", "Active", "Archived"];

    const { data: courses, isLoading, error: getEnrolledError } = useQuery({
        queryKey: ["courses", "enrolled", { debouncedSearchValue }],
        queryFn: () => getEnrolledCourses(searchValue),
        enabled: currentUserRole !== "Admin",
        staleTime: 60_000 * 5
    })

    const { data: users, isLoading: usersIsLoading, error: getUsersError } = useQuery({
        queryKey: ["users", currentAdminTab],
        queryFn: () => getUsersByStatus(currentAdminTab),
        enabled: currentUserRole === "Admin",
        staleTime: 60_000 * 5
    })

    const { mutateAsync: modifyUserStatus } = useMutation<void, Error, UpdateStatusMutationVariables>({
        mutationFn: ({ userId, statusIndex }) => updateUserStatus(userId, statusIndex),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users"] })
            setIsSubmitting(false);
        },
        onError: (error) => {
            setIsSubmitting(false);
            alert(error instanceof Error
                ? error.message || "Unknown error"
                : new Error("An unexpected error occurred")
            );
        }
    })

    const { mutateAsync: removeUser } = useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users", currentAdminTab] })
            setIsSubmitting(false);
        },
        onError: (error) => {
            setIsSubmitting(false);
            alert(error instanceof Error
                ? error.message || "Unknown error"
                : new Error("An unexpected error occurred")
            );
        }
    })

    let content: JSX.Element | null = null;
    if (isLoading || usersIsLoading) {
        content = (
            <section className="flex h-full items-center justify-center">
                <Spinner />
            </section>
        );
    }
    else if (getEnrolledError) {
        content = <p className="text-red-500 font-bold text-center text-xl mt-8">Error - {getEnrolledError.message}</p>;
    }
    else if (getUsersError) {
        content = <p className="text-red-500 font-bold text-center text-xl mt-8">Error - {getUsersError.message}</p>;
    }
    else if (currentUserRole === "Admin") {
        content = (
            <ul>
                {users!.map(u => (
                    <li key={u.id}>
                        <div className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                            <div
                                className="text-xl max-w-[30%] overflow-hidden whitespace-nowrap text-ellipsis mr-4 flex-1"
                                title={u.fullName}
                            >
                                <strong>{u.fullName}</strong>
                            </div>
                            <div
                                className="text-xl max-w-[30%] overflow-hidden whitespace-nowrap text-ellipsis mr-4 flex-1"
                                title={u.email}
                            >
                                {u.email}
                            </div>
                            <span className="text-xl">{u.roleName}</span>
                            {currentAdminTab === "Pending" ? (
                                <div className='flex flex-row'>
                                    <TransparentButton
                                        iconSrc={UserAccept}
                                        onClick={async () => {
                                            setIsSubmitting(true);
                                            await modifyUserStatus({
                                                userId: u.id,
                                                statusIndex: 1
                                            })
                                        }}
                                        disabled={isSubmitting}
                                    />
                                    <div className='ml-4'></div>
                                    <TransparentButton
                                        iconSrc={UserDelete}
                                        onClick={async () => {
                                            setIsSubmitting(true);
                                            await removeUser(u.id)
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            ) : (currentAdminTab === "Active" ? (
                                <div className='flex flex-row'>
                                    <div className='ml-2'></div>
                                    <TransparentButton
                                        iconSrc={UserArchive}
                                        onClick={async () => {
                                            setIsSubmitting(true);
                                            await modifyUserStatus({
                                                userId: u.id,
                                                statusIndex: 2
                                            })
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            ) : (
                                <div className='flex flex-row'>
                                    <div className='ml-2'></div>
                                    <TransparentButton
                                        iconSrc={UndoArchive}
                                        onClick={async () => {
                                            setIsSubmitting(true);
                                            await modifyUserStatus({
                                                userId: u.id,
                                                statusIndex: 1
                                            })
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            ))
                            }
                        </div>
                    </li>
                ))
                }
            </ul>
        )
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
                            onClick={() => {
                                homeContext?.setCurrentCourseId(c.id);
                                homeContext?.setCurrentCourseOwnerId(c.ownerId);
                            }} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        isSubmittingDebounced && isSubmitting ? (
            <LoadingView />
        ) : currentUserRole === "Admin" ? (
            <>
                <div className="flex justify-center gap-x-64 my-4">
                    {adminTabs.map((tab, i) => (
                        <div key={i}>
                            <TransparentButton
                                text={tab}
                                onClick={() => setCurrentAdminTab(tab as UserStatus)}
                                withEffect={tab === currentAdminTab}
                                textSize="text-2xl"
                                isAdminTab={true}
                            />
                        </div>
                    ))}
                </div>
                {content}
            </>
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

export default HomePage