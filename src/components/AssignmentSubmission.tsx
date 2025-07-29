import type { BasicAssignmentSubmission } from '../types/assignmentSubmission';
import { formatDate } from '../utils/date';

interface AssignmentSubmissionProps {
    submission: BasicAssignmentSubmission;
    assignmentMaxGrade: number;
}

const AssignmentSubmission = ({ submission, assignmentMaxGrade }: AssignmentSubmissionProps) => {
    return (
        <div className="flex flex-row items-center w-full">
            <span className='w-7/12 mr-2 overflow-hidden text-ellipsis whitespace-nowrap' title={submission.authorFullName}><strong>{submission.authorFullName}</strong></span>
            <span className='w-1/6 overflow-hidden text-ellipsis whitespace-nowrap'><strong>Grade:</strong> {submission.grade !== null ? submission.grade : "-"}/{assignmentMaxGrade}</span>
            <span className='w-1/4 overflow-hidden text-ellipsis whitespace-nowrap text-right'><strong>Date:</strong> {formatDate(submission.latestSubmissionDate)}</span>
        </div>
    )
}

export default AssignmentSubmission