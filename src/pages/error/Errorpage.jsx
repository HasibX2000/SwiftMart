import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">
        Oops! Something went wrong.
      </h1>
      <p className="mb-8 text-xl text-gray-700">
        We're sorry, but we couldn't find the page you were looking for.
      </p>
      <Link
        to="/"
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-600"
      >
        Go back to homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
