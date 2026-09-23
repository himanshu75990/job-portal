import { useEffect } from 'react';
import { useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch';
import { deleteJob, getMyJobs } from '@/api/jobs';
import JobCard from '@/components/job-card';

const MyJobs = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    loading: loadingMyJobs,
    data: myJobs,
    fn: fnMyJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user?.id,
  });

  const { fn: fnDeleteJob, loading: loadingDeleteJob } = useFetch(deleteJob, {});

  // Redirect if not a recruiter
  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.role !== 'recruiter') {
      navigate('/');
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnMyJobs();
  }, [isLoaded]);

  const handleDeleteJob = async (job_id) => {
    await fnDeleteJob({ job_id });
    fnMyJobs(); // Refresh list
  };

  if (!isLoaded || loadingMyJobs) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold pb-8 text-5xl sm:text-7xl text-center">
        My Jobs
      </h1>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myJobs?.length > 0 ? (
          myJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isMyJob
              onJobDelete={() => handleDeleteJob(job.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-muted-foreground text-xl mt-20">
              No Jobs Posted Yet 😢
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
