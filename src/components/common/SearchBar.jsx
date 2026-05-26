import React from 'react';

const SearchBar = ({ placeholder = "Search items", value, onChange, onSearchClick }) => {
    return (
        <div className="relative flex items-center">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full sm:w-80 px-4 py-2 pl-10 text-sm border border-gray-200 focus:outline-none focus:border-[#1A8FA0] bg-white ${onSearchClick ? 'rounded-l-lg border-r-0' : 'rounded-lg'}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSearchClick) {
                            onSearchClick();
                        }
                    }}
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            {onSearchClick && (
                <button
                    onClick={onSearchClick}
                    className="bg-[#1A8FA0] text-white px-4 py-2 text-sm rounded-r-lg hover:bg-[#137280] transition-colors border border-[#1A8FA0] cursor-pointer"
                >
                    Search
                </button>
            )}
        </div>
    );
};

export default SearchBar;