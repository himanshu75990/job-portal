// ─── Jobs API ────────────────────────────────────────────────────────────────

/**
 * Fetch all jobs, with optional search and filters.
 * @param {Object} supabase
 * @param {Object} options - { location, company_id, searchQuery }
 */
export async function getJobs(supabase, { location, company_id, searchQuery } = {}) {
  let query = supabase
    .from('jobs')
    .select('*, company: companies(name, logo_url), saved: saved_jobs(id)');

  if (location) query = query.eq('location', location);
  if (company_id) query = query.eq('company_id', company_id);
  if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

  const { data, error } = await query;
  if (error) throw new Error('Error fetching jobs');
  return { data };
}

/**
 * Fetch a single job by id.
 */
export async function getSingleJob(supabase, _options, { job_id }) {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      '*, company: companies(name, logo_url), applications: applications(*)'
    )
    .eq('id', job_id)
    .single();

  if (error) throw new Error('Error fetching job');
  return { data };
}

/**
 * Save or unsave a job for the current user.
 */
export async function saveJob(supabase, _options, { alreadySaved, job_id, user_id }) {
  if (alreadySaved) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('job_id', job_id);
    if (error) throw new Error('Error removing saved job');
    return { data };
  } else {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert([{ job_id, user_id }]);
    if (error) throw new Error('Error saving job');
    return { data };
  }
}

/**
 * Get all saved jobs for a user.
 */
export async function getSavedJobs(supabase) {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select('*, job: jobs(*, company: companies(name, logo_url))');
  if (error) throw new Error('Error fetching saved jobs');
  return { data };
}

/**
 * Add a new job posting (recruiter).
 */
export async function addNewJob(supabase, _options, jobData) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select();
  if (error) throw new Error('Error creating job');
  return { data };
}

/**
 * Delete a job posting (recruiter).
 */
export async function deleteJob(supabase, _options, { job_id }) {
  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', job_id)
    .select();
  if (error) throw new Error('Error deleting job');
  return { data };
}

/**
 * Get all jobs posted by a recruiter.
 */
export async function getMyJobs(supabase, { recruiter_id }) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, company: companies(name, logo_url)')
    .eq('recruiter_id', recruiter_id);
  if (error) throw new Error('Error fetching your jobs');
  return { data };
}

/**
 * Toggle a job's open/closed status.
 */
export async function updateHiringStatus(supabase, _options, { job_id, isOpen }) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ isOpen })
    .eq('id', job_id)
    .select();
  if (error) throw new Error('Error updating hiring status');
  return { data };
}
