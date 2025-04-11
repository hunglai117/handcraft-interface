import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function SearchBox({ isOpen, onClose, onOpen }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close modal and slash key to open it
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on ESC key
      if (e.key === "Escape" && isOpen) {
        onClose();
      }

      // Open on slash key, but only if not typing in an input or textarea
      if (e.key === "/" && !isOpen) {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();

        // Prevent opening when typing in form elements
        if (
          tagName !== "input" &&
          tagName !== "textarea" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          onOpen();
        }
      }
    };

    // Add keydown listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/products/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm">
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal with animation - properly positioned 30px from top */}
      <div
        className="flex justify-center px-4 text-center"
        style={{ marginTop: "30px" }}
      >
        <div
          className="relative inline-block w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-8 text-left shadow-2xl transition-all px-6 py-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Search form with enhanced styling */}
          <form onSubmit={handleSearch} className="mt-2">
            <div className="flex border-2 border-primary rounded-lg overflow-hidden shadow-sm transition-all focus-within:shadow-md focus-within:border-opacity-80 hover:border-opacity-90 input w-full items-center px-4 py-2">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                required
                placeholder="What are you looking for?"
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full focus:outline-none text-gray-700 text-lg placeholder-gray-400"
              />
            </div>
          </form>

          {/* Recent searches section */}
          <div className="mt-8 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">
                Recent searches
              </p>
              <button className="text-xs text-primary hover:underline cursor-pointer">
                Clear all
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {["Handcrafted vase", "Wooden bowl", "Ceramic plate"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="flex items-center w-full px-2 py-1.5 hover:bg-gray-50 rounded-md text-left text-sm text-gray-700 group"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400 mr-2 group-hover:text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
