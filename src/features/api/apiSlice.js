// Import necessary dependencies from Redux Toolkit and Supabase
import { createApi } from "@reduxjs/toolkit/query/react";
import supabase from "../../configs/supabase";

// Define and export the apiSlice
// This slice serves as the foundation for all API interactions in the application
export const apiSlice = createApi({
  // Specify the reducer path for this slice
  reducerPath: "api",

  // Define the base query function
  // This function handles all API requests using Supabase
  baseQuery: async ({ url, method, body }) => {
    try {
      let result;

      // Perform Supabase operations based on the HTTP method
      switch (method) {
        case "GET":
          // Fetch data from the specified table
          result = await supabase.from(url).select();
          break;
        case "POST":
          // Insert new data into the specified table
          result = await supabase.from(url).insert(body);
          break;
        case "PUT":
          // Update existing data in the specified table
          result = await supabase.from(url).update(body).match({ id: body.id });
          break;
        case "PATCH":
          // Partially update existing data in the specified table
          result = await supabase.from(url).update(body).match({ id: body.id });
          break;
        case "DELETE":
          // Delete data from the specified table
          result = await supabase.from(url).delete().match({ id: body.id });
          break;
        default:
          // Throw an error for unsupported HTTP methods
          throw new Error(`Unsupported method ${method}`);
      }

      // Return the result data
      return { data: result.data };
    } catch (error) {
      // Return any errors that occur during the API request
      return { error: error.message };
    }
  },

  // Define the initial set of endpoints
  // This can be extended using injectEndpoints in other files
  endpoints: (builder) => ({}),
});

// Export hooks for each endpoint
// This line would typically export auto-generated hooks, but since no endpoints
// are defined here, it's an empty object. Endpoints will be injected from other files.
export const {} = apiSlice;
