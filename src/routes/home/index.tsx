import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState, type JSX } from "react";
import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import { deleteUser, getEnrolledCourses, getUsersByStatus, updateUserStatus } from '../../services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { HomeContext, UserContext } from './route';
import TransparentButton from '../../components/TransparentButton';
import type { UserStatus } from '../../types/user';
import UserAccept from "/user-accept.svg"
import UserDelete from "/user-delete.svg"

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

    const adminTabs: UserStatus[] = ["Pending", "Active", "Archived"];

    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ["courses", "enrolled", { debouncedSearchValue }],
        queryFn: () => getEnrolledCourses(searchValue),
        enabled: currentUserRole !== "Admin",
        staleTime: 60_000 * 5
    })

    const { data: users, isLoading: usersIsLoading, isError: usersIsError } = useQuery({
        queryKey: ["users", currentAdminTab],
        queryFn: () => getUsersByStatus(currentAdminTab),
        enabled: currentUserRole === "Admin",
        staleTime: 60_000 * 5
    })

    const { mutateAsync: modifyUserStatus } = useMutation<void, Error, UpdateStatusMutationVariables>({
        mutationFn: ({ userId, statusIndex }) => updateUserStatus(userId, statusIndex),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users"] })
        },
        onError: () => {
            alert("An error occured while updating a user status.")
        }
    })

    const { mutateAsync: removeUser } = useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users", currentAdminTab] })
        },
        onError: () => {
            alert("An error occured while updating a user status.")
        }
    })

    let content: JSX.Element | null = null;
    if (isLoading || usersIsLoading) {
        content = <Spinner />;
    }
    else if (isError || usersIsError) {
        content = <p className="text-red-500">Error.</p>;
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
                                        onClick={async () => await modifyUserStatus({
                                            userId: u.id, 
                                            statusIndex: 1
                                        })}
                                    />
                                    <div className='ml-4'></div>
                                    <TransparentButton
                                        iconSrc={UserDelete}
                                        onClick={async () => await removeUser(u.id)}
                                    />
                                </div>
                            ) : (currentAdminTab === "Active" ? (
                                <div className='flex flex-row'>
                                    <div className='ml-2'></div>
                                    <TransparentButton
                                        iconSrc={UserDelete}
                                        onClick={async () => await modifyUserStatus({
                                            userId: u.id, 
                                            statusIndex: 2
                                        })}
                                    />
                                </div>
                            ) : (
                                <div className='flex flex-row'>
                                    <div className='ml-2'></div>
                                    <TransparentButton
                                        iconSrc={UserAccept}
                                        onClick={async () => await modifyUserStatus({
                                            userId: u.id, 
                                            statusIndex: 1
                                        })}
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
                                homeContext?.setCurrentCourseName(c.name);
                            }} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        currentUserRole === "Admin" ? (
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
            <div className="h-full w-full">
                <SearchBar
                    searchValue={searchValue}
                    onSearch={setSearchValue}
                    placeholder="Search for courses..."
                />
                <section className="space-y-9">
                    {content}
                </section>
            </div >
        )
    )
}

export default HomePage