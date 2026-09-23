import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { saveJob } from '@/api/jobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/react';

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
  onJobDelete = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { fn: fnSaveJob, data: savedJob, loading: loadingSaveJob } = useFetch(saveJob, {
    alreadySaved: saved,
    job_id: job.id,
    user_id: user?.id,
  });

  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savJobData => savJobData);
    }
  }, [savedJob]);

  const handleSaveJob = async () => {
    await fnSaveJob({
      alreadySaved: saved,
      job_id: job.id,
      user_id: user?.id,
    });
    onJobSaved();
    setSaved(!saved);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {/* Show delete icon if this is the recruiter's own job listing */}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={onJobDelete}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {/* Company logo */}
          {job.company && (
            <img src={job.company.logo_url} className="h-6" alt={job.company.name} />
          )}
          {/* Location */}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} />
            {job.location}
          </div>
        </div>

        <hr />

        {/* Job description snippet */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job?.description?.substring(0, 150)}...
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        {/* Link to full job page */}
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button className="w-full" variant="secondary">
            More Details
          </Button>
        </Link>

        {/* Save/unsave toggle (hidden for recruiter's own jobs) */}
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSaveJob}
          >
            <Heart
              size={20}
              stroke="red"
              fill={saved ? 'red' : 'none'}
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
