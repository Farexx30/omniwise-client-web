import Spinner from './Spinner'

const LoadingView = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-black/20 h-full w-full rounded-2xl p-4 text-white overflow-hidden gap-4">
            <div className="shrink-0">
                <Spinner />
            </div>
            <h3 className="text-white">Just a moment...</h3>
        </div>
    )
}

export default LoadingView