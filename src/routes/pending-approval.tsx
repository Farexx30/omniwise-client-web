import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/pending-approval')({
  component: PendingApprovalPage,
})

function PendingApprovalPage() {
  return (
    <div className="login-and-registration-container">
      <div className="flex flex-col justify-center px-10 py-8 rounded-2xl shadow-2xl bg-[#222224]/50 w-full max-w-4xl h-full max-h-1/2 ">
        <div className="text-left mt-24">
          <h1 className="text-left">Waiting...</h1>
          <div className="text-xl mt-4 text-white">
            <p>Your account needs to be approved by administrator.</p>
          </div>
        </div>
        <div className="p-2 flex justify-center text-xl mt-24">
          <Link to="/login" className="w-auto bg-[#8C47F6] text-white px-16 py-2 block mx-auto rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_16px_4px_rgba(168,85,247,0.7)]">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
