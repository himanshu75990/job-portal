import { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { getJobs } from '@/api/jobs';
import { getCompanies } from '@/api/companies';
import useFetch from '@/hooks/use-fetch';
import JobCard from '@/components/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// List of common Indian job locations
const locations = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Noida',
  'Gurugram', 'Remote',
];

const JobListing = () => {
  const { isLoaded } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [company_id, setCompany_id] = useState('');

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  // Load companies once on mount
  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  // Refetch jobs whenever filters change
  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get('search-query');
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setCompany_id('');
  };

  if (!isLoaded) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* ── Search & Filters ───────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="flex w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title..."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      {/* Location & Company Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Location filter */}
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
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

        {/* Company filter */}
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
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

        {/* Clear all filters button */}
        <Button
          variant="destructive"
          onClick={clearFilters}
          className="sm:w-1/2"
        >
          Clear Filters
        </Button>
      </div>

      {/* ── Job Grid ──────────────────────────────────────────────────── */}
      {loadingJobs && (
        <p className="text-center mt-10 text-muted-foreground">Loading jobs...</p>
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-muted-foreground text-xl mt-20">
                No Jobs Found 😢
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
