import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

const Header = () => {
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
                            Post a Job
                        </Button>
                    </Link>
                    <UserButton />
                </Show>
            </div>
        </nav>
    )
}

export default Header
