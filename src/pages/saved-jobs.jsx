import { useEffect } from 'react';
import { useUser } from '@clerk/react';
import useFetch from '@/hooks/use-fetch';
import { getSavedJobs, saveJob } from '@/api/jobs';
import JobCard from '@/components/job-card';

const SavedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold pb-8 text-5xl sm:text-7xl text-center">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length > 0 ? (
            savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved.job}
                savedInit={true}
                onJobSaved={fnSavedJobs}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-muted-foreground text-xl mt-20">
                No Saved Jobs Found 😢
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
