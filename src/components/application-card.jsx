import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { updateApplicationStatus } from '@/api/applications';
import useFetch from '@/hooks/use-fetch';

const ApplicationCard = ({ application, isCandidate = false }) => {
  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {}
  );

  const handleStatusChange = (status) => {
    fnHiringStatus({ job_id: application.job_id, status });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}

          <a href={application?.resume} target="_blank" rel="noopener noreferrer">
            <button className="text-blue-500 underline text-sm">Resume ↗</button>
          </a>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Experience
            </span>
            <span>{application.experience} years</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Education
            </span>
            <span className="capitalize">{application.education}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Skills
            </span>
            <span>{application.skills}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Applied: {new Date(application.created_at).toLocaleDateString()}
        </span>

        {/* Recruiters can update status; candidates just see it */}
        {isCandidate ? (
          <span className="font-bold capitalize">{application.status}</span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
