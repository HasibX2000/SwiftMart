// Import the Supabase client creation function
import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase URL and anonymous key from environment variables
// These variables should be set in the project's environment configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export a Supabase client instance
// This client will be used throughout the application for database operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the Supabase client as the default export
// This allows other parts of the application to import and use the client easily
export default supabase;
