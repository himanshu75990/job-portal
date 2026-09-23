import { useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // If the user already has a role set, redirect them
  useEffect(() => {
    if (user?.unsafeMetadata?.role === 'recruiter') navigate('/post-job');
    else if (user?.unsafeMetadata?.role === 'candidate') navigate('/job');
  }, [user]);

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        navigate(role === 'recruiter' ? '/post-job' : '/job');
      })
      .catch((err) => {
        console.error('Error updating role:', err);
      });
  };

  if (!isLoaded) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40 gap-6 text-center">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>

      <div className="mt-16 grid md:grid-cols-2 gap-4 w-full md:px-40">
        {/* Candidate card */}
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection('candidate')}
        >
          Candidate
        </Button>

        {/* Recruiter card */}
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection('recruiter')}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
