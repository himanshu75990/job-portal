// ─── Companies API ────────────────────────────────────────────────────────────

/**
 * Fetch all companies.
 */
export async function getCompanies(supabase) {
  const { data, error } = await supabase.from('companies').select('*');
  if (error) throw new Error('Error fetching companies');
  return { data };
}

/**
 * Add a new company with logo upload.
 */
export async function addNewCompany(supabase, _options, { name, logo }) {
  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${name}`;

  // Upload logo to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('company-logo')
    .upload(fileName, logo);

  if (storageError) throw new Error('Error uploading company logo');

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('company-logo')
    .getPublicUrl(fileName);

  // Insert company record
  const { data, error } = await supabase
    .from('companies')
    .insert([{ name, logo_url: urlData.publicUrl }])
    .select();

  if (error) throw new Error('Error creating company');
  return { data };
}
