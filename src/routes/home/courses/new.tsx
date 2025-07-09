import { createFileRoute, useRouter } from '@tanstack/react-router'
import ShadowLink from '../../../components/ShadowLink';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import ShadowButton from '../../../components/ShadowButton';
import { createCourse } from '../../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/home/courses/new')({
    component: CreateCourse,
})

function CreateCourse() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [img, setImg] = useState<File | null>(null);

    const { mutateAsync: addCourse } = useMutation({
        mutationFn: (formData: FormData) => createCourse(formData),
        onSuccess: (courseId) => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
            router.navigate({
                to: "/home/courses/$courseId",
                params: {
                    courseId: courseId.toString()
                }
            })
        },
        onError: () => {
            alert("An error occured while creating a course.")
        }
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name)

        if (img !== null) {
            formData.append("img", img)
        }

        await addCourse(formData);
    }

    function handleImgChange(e: FormEvent<HTMLInputElement>): void {
        e.preventDefault();

        const target = e.target as HTMLInputElement & {
            files: FileList;
        }

        setImg(target.files[0])
    }

    return (
        <form
            className="flex flex-col items-center justify-center bg-black/20 h-full w-full rounded-2xl p-4 text-white"
            onSubmit={handleSubmit}>
            <div className="w-full h-16 mt-8 px-32">
                <input
                    type="text"
                    placeholder="New course..."
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
                />
            </div>
            <div className="flex flex-col relative w-full h-16 mt-8 items-center justify-center">
                <label htmlFor="course-img" className="text-2xl">Choose a course image</label>
                <input
                    id="course-img"
                    type="file"
                    onChange={handleImgChange}
                />
            </div>
            <div className="flex justify-center text-xl mt-18 [&>*]:px-18">
                <ShadowButton
                    text="Add"
                    isSubmitType={true}
                />
            </div>
        </form>
    );

}
