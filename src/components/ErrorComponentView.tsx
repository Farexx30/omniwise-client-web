const ErrorComponentView = ({ message }: { message?: string }) => {
    return (
        <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col items-center">
            <p className="text-red-500 font-bold text-center text-xl mt-8">Error - {message}</p>
        </div>
    )
}

export default ErrorComponentView