// ─── Applications API ─────────────────────────────────────────────────────────

/**
 * Apply to a job (upload resume to storage, then create application record).
 */
export async function applyToJob(supabase, _options, { job_id, user_id, name, experience, skills, education, resume }) {
  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${name}`;

  // Upload resume to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('resumes')
    .upload(fileName, resume);

  if (storageError) throw new Error('Error uploading resume');

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  // Insert application record
  const { data, error } = await supabase
    .from('applications')
    .insert([{
      job_id,
      candidate_id: user_id,
      name,
      experience,
      skills,
      education,
      resume: urlData.publicUrl,
      status: 'applied',
    }])
    .select();

  if (error) throw new Error('Error submitting application');
  return { data };
}

/**
 * Update the status of an application (recruiter action).
 */
export async function updateApplicationStatus(supabase, _options, { job_id, status }) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('job_id', job_id)
    .select();

  if (error) throw new Error('Error updating application status');
  return { data };
}

/**
 * Get all applications submitted by the current user (job seeker).
 */
export async function getApplications(supabase, { user_id }) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job: jobs(title, company: companies(name))')
    .eq('candidate_id', user_id);

  if (error) throw new Error('Error fetching applications');
  return { data };
}
