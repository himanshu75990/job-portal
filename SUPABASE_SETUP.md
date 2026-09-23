# 🏗️ Supabase Database Setup

Run the following SQL in your **Supabase SQL Editor** to set up the database schema with Row Level Security (RLS).

## Step 1: Create Tables

```sql
-- Companies table
CREATE TABLE companies (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  logo_url TEXT
);

-- Jobs table
CREATE TABLE jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
  recruiter_id TEXT NOT NULL,  -- Clerk user ID
  requirements TEXT,
  isOpen BOOLEAN DEFAULT TRUE
);

-- Saved Jobs table
CREATE TABLE saved_jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT NOT NULL,  -- Clerk user ID
  job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE(user_id, job_id)
);

-- Applications table
CREATE TABLE applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL,  -- Clerk user ID
  name TEXT,
  experience INT,
  skills TEXT,
  education TEXT,
  resume TEXT,  -- URL from Supabase Storage
  status TEXT DEFAULT 'applied'  -- applied | interviewing | hired | rejected
);
```

## Step 2: Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
```

## Step 3: Create RLS Policies

### Companies (public read, auth write)
```sql
-- Anyone can read companies
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT USING (TRUE);

-- Authenticated users can insert companies
CREATE POLICY "Authenticated users can create companies"
  ON companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### Jobs (public read, recruiter write)
```sql
-- Anyone can read open jobs
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT USING (TRUE);

-- Recruiters can create jobs
CREATE POLICY "Recruiters can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = recruiter_id);

-- Recruiters can update their own jobs
CREATE POLICY "Recruiters can update their own jobs"
  ON jobs FOR UPDATE
  USING (auth.jwt() ->> 'sub' = recruiter_id);

-- Recruiters can delete their own jobs
CREATE POLICY "Recruiters can delete their own jobs"
  ON jobs FOR DELETE
  USING (auth.jwt() ->> 'sub' = recruiter_id);
```

### Saved Jobs (user-scoped)
```sql
-- Users can read their own saved jobs
CREATE POLICY "Users can view their saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

-- Users can save jobs
CREATE POLICY "Users can save jobs"
  ON saved_jobs FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can unsave jobs
CREATE POLICY "Users can delete their saved jobs"
  ON saved_jobs FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);
```

### Applications (candidate write, recruiter read)
```sql
-- Candidates can view their own applications
CREATE POLICY "Candidates can view their own applications"
  ON applications FOR SELECT
  USING (auth.jwt() ->> 'sub' = candidate_id);

-- Recruiters can view applications for their jobs
CREATE POLICY "Recruiters can view applications for their jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
        AND jobs.recruiter_id = auth.jwt() ->> 'sub'
    )
  );

-- Candidates can submit applications
CREATE POLICY "Candidates can apply to jobs"
  ON applications FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = candidate_id);

-- Recruiters can update application status
CREATE POLICY "Recruiters can update application status"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
        AND jobs.recruiter_id = auth.jwt() ->> 'sub'
    )
  );
```

## Step 4: Create Storage Buckets

In Supabase Dashboard → Storage → Create two buckets:

1. **`company-logo`** — Public bucket (for company logos)
2. **`resumes`** — Public bucket (for applicant resumes)

### Storage Policies for company-logo:
```sql
-- Anyone can read company logos
CREATE POLICY "Company logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logo');

-- Authenticated users can upload company logos
CREATE POLICY "Authenticated users can upload company logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'company-logo' AND auth.role() = 'authenticated');
```

### Storage Policies for resumes:
```sql
-- Authenticated users can read resumes
CREATE POLICY "Resumes are accessible to authenticated users"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Candidates can upload resumes
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
```

## Step 5: Clerk Integration with Supabase

In **Supabase Dashboard → Project Settings → Auth → Auth Providers**:
- Enable **JWT** authentication
- Set **JWT Secret** from your Clerk Dashboard:
  - Clerk Dashboard → API Keys → Show JWT Public Key

In **Clerk Dashboard → JWT Templates**:
- Create a template named `supabase`
- Set the signing algorithm to match Supabase's expectation

## Step 6: Seed Sample Data

```sql
-- Insert some companies
INSERT INTO companies (name, logo_url) VALUES
  ('Google', 'https://logo.clearbit.com/google.com'),
  ('Microsoft', 'https://logo.clearbit.com/microsoft.com'),
  ('Amazon', 'https://logo.clearbit.com/amazon.com'),
  ('Meta', 'https://logo.clearbit.com/meta.com'),
  ('Netflix', 'https://logo.clearbit.com/netflix.com');

-- Insert sample jobs (replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID)
INSERT INTO jobs (title, description, location, company_id, recruiter_id, requirements, isOpen) VALUES
  ('Senior React Developer', 'We are looking for an experienced React developer...', 'Bengaluru', 1, 'YOUR_CLERK_USER_ID', 'React, TypeScript, 3+ years experience', TRUE),
  ('Full Stack Engineer', 'Join our growing team building exciting products...', 'Remote', 2, 'YOUR_CLERK_USER_ID', 'Node.js, React, PostgreSQL', TRUE),
  ('Frontend Developer', 'Build beautiful user interfaces for millions of users...', 'Mumbai', 3, 'YOUR_CLERK_USER_ID', 'HTML, CSS, JavaScript, React', TRUE);
```
