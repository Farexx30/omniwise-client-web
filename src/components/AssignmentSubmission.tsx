import type { Submission } from '../types/assignment'
import { formatDate } from '../utils/date';

interface AssignmentSubmissionProps {
    submission: Submission;
    assignmentMaxGrade: number;
}

const AssignmentSubmission = ({ submission, assignmentMaxGrade }: AssignmentSubmissionProps) => {
    return (
        <>
            <p><strong> {submission.authorFullName}</strong></p>
            <div className="flex flex-row ">
                <p><strong>Grade:</strong> {submission.grade !== null ? submission.grade : "-"}/{assignmentMaxGrade}</p>
                <p className='ml-8'><strong>Date:</strong> {formatDate(submission.latestSubmissionDate)}</p>
            </div>
        </>
    )
}

export default AssignmentSubmission