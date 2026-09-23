import { useEffect } from 'react';
import { useUser } from '@clerk/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { applyToJob } from '@/api/applications';
import useFetch from '@/hooks/use-fetch';

// ─── Validation Schema ─────────────────────────────────────────────────────
const schema = z.object({
  experience: z
    .number()
    .min(0, { message: 'Experience must be at least 0' })
    .int(),
  skills: z.string().min(1, { message: 'Skills are required' }),
  education: z.enum(['intermediate', 'graduate', 'post graduate'], {
    message: 'Education is required',
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === 'application/pdf' ||
          file[0].type === 'application/msword'),
      { message: 'Only PDF or Word documents are allowed' }
    ),
});

const ApplyJobDrawer = ({ user, job, fetchJob, applied = false }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
    data: dataApply,
  } = useFetch(applyToJob, {});

  useEffect(() => {
    if (dataApply?.length > 0) {
      fetchJob();
      reset();
    }
  }, [dataApply]);

  const onSubmit = (data) => {
    fnApply({
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      experience: parseInt(data.experience),
      skills: data.skills,
      education: data.education,
      resume: data.resume[0],
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? 'default' : 'destructive'}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? 'Applied' : 'Apply') : 'Hiring Closed'}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          {/* Years of Experience */}
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register('experience', {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-500 text-sm">{errors.experience.message}</p>
          )}

          {/* Skills */}
          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register('skills')}
          />
          {errors.skills && (
            <p className="text-red-500 text-sm">{errors.skills.message}</p>
          )}

          {/* Education */}
          <RadioGroup {...register('education')}>
            <Label>Education</Label>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="graduate" id="graduate" />
              <Label htmlFor="graduate">Graduate</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="post graduate" id="post-graduate" />
              <Label htmlFor="post-graduate">Post Graduate</Label>
            </div>
          </RadioGroup>
          {errors.education && (
            <p className="text-red-500 text-sm">{errors.education.message}</p>
          )}

          {/* Resume Upload */}
          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register('resume')}
          />
          {errors.resume && (
            <p className="text-red-500 text-sm">{errors.resume.message}</p>
          )}

          {/* Error from Supabase */}
          {errorApply?.message && (
            <p className="text-red-500 text-sm">{errorApply?.message}</p>
          )}

          {loadingApply && <p>Submitting application...</p>}

          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
