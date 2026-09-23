import { useEffect } from 'react';
import { useUser, Show } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AddCompanyDrawer from '@/components/add-company-drawer';
import useFetch from '@/hooks/use-fetch';
import { getCompanies } from '@/api/companies';
import { addNewJob } from '@/api/jobs';

// ─── Validation ───────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  company_id: z.string().min(1, { message: 'Company is required' }),
  requirements: z.string().min(1, { message: 'Requirements are required' }),
});

const locations = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Noida',
  'Gurugram', 'Remote',
];

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { location: '', company_id: '', requirements: '' },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies, {});

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob, {});

  // Load companies when Clerk is ready
  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  // Redirect to My Jobs after successful posting
  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      navigate('/my-job');
    }
  }, [loadingCreateJob]);

  // Redirect non-recruiters away
  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.role !== 'recruiter') {
      navigate('/');
    }
  }, [isLoaded, user]);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  if (!isLoaded) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        {/* Job Title */}
        <Input placeholder="Job Title" {...register('title')} />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}

        {/* Description */}
        <Textarea
          placeholder="Job Description"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        {/* Location + Company row */}
        <div className="flex gap-4 items-center">
          {/* Location */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Company */}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company Name">
                    {field.value
                      ? companies?.find((com) => com.id == Number(field.value))?.name
                      : 'Company Name'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Add new company inline */}
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>

        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        {/* Requirements */}
        <Textarea
          placeholder="Requirements"
          {...register('requirements')}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {/* API error */}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}

        {/* Submit */}
        {loadingCreateJob && <p className="text-muted-foreground">Posting job...</p>}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
