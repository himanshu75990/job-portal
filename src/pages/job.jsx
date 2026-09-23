import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { getSingleJob, updateHiringStatus } from '@/api/jobs';
import useFetch from '@/hooks/use-fetch';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ApplyJobDrawer from '@/components/apply-job';
import ApplicationCard from '@/components/application-card';
import { Separator } from '@/components/ui/separator';

const JobPage = () => {
  const { id } = useParams();
  const { user, isLoaded } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {}
  );

  useEffect(() => {
    if (isLoaded) fnJob({ job_id: id });
  }, [isLoaded, id]);

  const handleStatusChange = (value) => {
    const isOpen = value === 'open';
    fnHiringStatus({ job_id: job.id, isOpen }).then(() => fnJob({ job_id: id }));
  };

  if (!isLoaded || loadingJob) {
    return <div className="text-center mt-20 text-muted-foreground">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center mt-20">Job not found.</div>;
  }

  // Check if the current user has already applied
  const applied = job.applications?.find(
    (ap) => ap.candidate_id === user?.id
  );

  // Check if the current user is the recruiter who posted this job
  const isRecruiter = job.recruiter_id === user?.id;

  return (
    <div className="flex flex-col gap-8 mt-5">
      {/* ── Title Row ────────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        {job?.company && (
          <img
            src={job.company.logo_url}
            className="h-12"
            alt={job.company.name}
          />
        )}
      </div>

      {/* ── Meta Info ────────────────────────────────────────────────── */}
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <MapPinIcon />
          {job?.location}
        </div>

        <div className="flex gap-2 items-center">
          <Briefcase />
          {job?.applications?.length} Applicants
        </div>

        <div className="flex gap-2 items-center">
          {job?.isOpen ? (
            <>
              <DoorOpen />
              <span className="text-green-500">Open</span>
            </>
          ) : (
            <>
              <DoorClosed />
              <span className="text-red-500">Closed</span>
            </>
          )}
        </div>
      </div>

      {/* ── Recruiter: Hiring Status Toggle ───────────────────────────── */}
      {isRecruiter && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? 'bg-green-950' : 'bg-red-950'}`}
          >
            <SelectValue
              placeholder={`Hiring Status: ${job?.isOpen ? 'Open' : 'Closed'}`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* ── Description ──────────────────────────────────────────────── */}
      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      {/* ── Requirements ─────────────────────────────────────────────── */}
      {job?.requirements && (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold">
            What we are looking for
          </h2>
          <p className="sm:text-lg whitespace-pre-line">{job.requirements}</p>
        </>
      )}

      {/* ── Apply Button (for job seekers only) ────────────────────────── */}
      {!isRecruiter && (
        <div className="flex gap-4 mt-4">
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={!!applied}
          />
          {applied && (
            <p className="text-muted-foreground">
              Status: <strong>{applied.status}</strong>
            </p>
          )}
        </div>
      )}

      {/* ── Applications list (for the recruiter) ──────────────────── */}
      {isRecruiter && (
        <>
          <Separator />
          <h2 className="font-bold text-xl ml-1">Applications</h2>
          {job.applications?.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </>
      )}
    </div>
  );
};

export default JobPage;
