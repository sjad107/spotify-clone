import React from "react";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search for artists, songs, or podcasts"
        className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
