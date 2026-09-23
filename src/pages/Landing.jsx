import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, SignInButton } from '@clerk/react';
import { useEffect } from 'react';

// ─── Data ──────────────────────────────────────────────────────────────────
const companies = [
  { name: 'Amazon', id: 1, path: '/amazon.svg' },
  { name: 'Netflix', id: 2, path: '/netflix.png' },
  { name: 'TCS', id: 3, path: '/tcs.png' },
  { name: 'Google', id: 4, path: '/google.webp' },
  { name: 'Microsoft', id: 5, path: '/microsoft.webp' },
  { name: 'Uber', id: 6, path: '/uber.svg' },
  { name: 'Meta', id: 7, path: '/meta.svg' },
];

const faqs = [
  {
    question: 'What types of jobs can I find on Hirrd?',
    answer:
      'Hirrd lists full-time, part-time, and remote opportunities across engineering, design, product, marketing, and more — from startups to Fortune 500 companies.',
  },
  {
    question: 'How do I apply for a job?',
    answer:
      'Create an account, browse jobs, and click "Apply". You\'ll fill out a quick form and upload your resume (PDF or Word). Done!',
  },
  {
    question: 'Can I post a job as an employer?',
    answer:
      'Absolutely. Sign up, complete the onboarding as a Recruiter, and use the "Post a Job" button. Your listing goes live immediately.',
  },
  {
    question: 'Is Hirrd free to use?',
    answer:
      'Job seekers can browse and apply for free. Recruiter posting features are free during the beta period.',
  },
  {
    question: 'How do I save interesting jobs to revisit later?',
    answer:
      'Click the ❤️ icon on any job card or detail page. All your saves are available under Saved Jobs in your account menu.',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Auto-redirect logged-in users who were sent back here to finish onboarding
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate('/job'); // if role already set, go to jobs
    }
  }, [user]);

  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Dream Job&nbsp;
          <span className="flex items-center gap-2 sm:gap-6">
            and get&nbsp;
            <img
              src="/logo.png"
              alt="Hirrd Logo"
              className="h-14 sm:h-24 lg:h-32"
            />
          </span>
        </h1>

        <p className="text-muted-foreground text-xs sm:text-xl mt-4">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>

      {/* ── CTA Buttons ──────────────────────────────────────────────── */}
      <div className="flex gap-6 justify-center">
        <Link to="/job">
          <Button variant="blue" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* ── Company Logos Carousel ────────────────────────────────────── */}
      <Carousel
        plugins={[]}
        className="w-full py-10"
        opts={{ loop: true }}
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* ── Banner Image ──────────────────────────────────────────────── */}
      <img src="/banner.jpeg" className="w-full" alt="Job Portal Banner" />

      {/* ── Feature Cards ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and manage your career all in one place.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best talent for your company efficiently.
          </CardContent>
        </Card>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
