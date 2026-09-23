import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react';
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';

const Header = () => {
  const { user } = useUser();

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src="/logo.png" className="h-20" alt="Hirrd Logo" />
      </Link>

      <div className="flex gap-4 items-center">
        {/* When user is NOT logged in */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="outline">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </Show>

        {/* When user IS logged in */}
        <Show when="signed-in">
          <Link to="/post-job">
            <Button variant="destructive" className="rounded-full">
              <PenBox size={20} className="mr-2" />
              Post a Job
            </Button>
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="My Jobs"
                labelIcon={<BriefcaseBusiness size={15} />}
                href="/my-job"
              />
              <UserButton.Link
                label="Saved Jobs"
                labelIcon={<Heart size={15} />}
                href="/saved-job"
              />
              <UserButton.Action label="manageAccount" />
            </UserButton.MenuItems>
          </UserButton>
        </Show>
      </div>
    </nav>
  );
};

export default Header;
