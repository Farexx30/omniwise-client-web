import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useContext, useState, type FormEvent } from 'react';
import ShadowButton from '../../../components/ShadowButton';
import { createCourse } from '../../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HomeContext } from '../route';
import FileInput from '../../../components/FileInput';
import { useFile } from '../../../hooks/useFile';

export const Route = createFileRoute('/home/courses/new')({
    component: CreateCourse,
})

function CreateCourse() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const homeContext = useContext(HomeContext);

    const [courseName, setCourseName] = useState("");

    const { files: imgs, onChange, removeFile, clearFiles } = useFile({ multiple: false });

    const { mutateAsync: addCourse } = useMutation({
        mutationFn: (formData: FormData) => createCourse(formData),
        onSuccess: (courseId) => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })

            homeContext?.setCurrentCourseId(courseId);
            homeContext?.setCurrentCourseName(courseName);

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
        formData.append("name", courseName)

        if (imgs.length > 0) {
            formData.append("img", imgs[0])
        }

        await addCourse(formData);
    }

    return (
        <form
            className="flex flex-col bg-black/20 h-full w-full rounded-2xl p-4 text-white overflow-hidden"
            onSubmit={handleSubmit}>
            <div className='flex items-end h-80 w-full'>
                <div className="w-full mt-8 px-32">
                    <input
                        type="text"
                        placeholder="New course..."
                        required
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center h-[calc(100vh-20rem)] overflow-y-auto w-full">
                <div className="flex flex-col relative w-full mt-8 items-center">
                    <p className="mb-2">Course image</p>
                    <FileInput
                        data={imgs}
                        onChange={onChange}
                        onFileIconClick={removeFile}
                        onClear={clearFiles}
                        multiple={false}
                        accept="image/png, image/jpg, image/jpeg, image/jfif, image/jiff, image/tiff, image/bmp, image/raw"
                        maxHeight="76"
                    />
                </div>
                <div className="text-xl mt-4 [&>*]:px-18 w-fit">
                    <ShadowButton
                        text="Add Course"
                        isSubmitType={true}
                        disabled={courseName.length < 3}
                    />
                </div>
            </div>
        </form>
    );

}
