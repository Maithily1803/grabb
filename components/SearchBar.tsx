"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { client } from "@/sanity/lib/client";

type SearchSuggestion = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
};

const SearchBar = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* Fetch suggestions */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const data = await client.fetch<SearchSuggestion[]>(
        `*[_type=="product" && name match $q + "*"][0..4]{
          _id,
          name,
          slug
        }`,
        { q: query }
      );
      setSuggestions(data);
    };

    fetchSuggestions();
  }, [query]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={ref} className="relative">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="hover:text-shop_dark_yellow transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-0 z-50 w-72 rounded-xl border bg-white shadow-md p-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Search products..."
            className="w-full text-sm px-3 py-2 border rounded-md outline-none"
          />

          {suggestions.length > 0 && (
            <ul className="mt-2 text-sm">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/product/${item.slug.current}`);
                  }}
                  className="px-3 py-2 cursor-pointer rounded-md hover:bg-gray-100"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

