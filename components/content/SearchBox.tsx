'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Tag, Folder } from "lucide-react";

type Suggestion = {
  type: "post" | "category" | "tag";
  label: string;
  slug: string;
  excerpt?: string;
};

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function SearchBox({ placeholder = "Search articles..." }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setIsOpen(data.suggestions?.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250),
    []
  );

  useEffect(() => {
    fetchSuggestions(q);
  }, [q, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigate(suggestion: Suggestion) {
    setIsOpen(false);
    setQ("");
    if (suggestion.type === "post") {
      router.push(`/posts/${suggestion.slug}`);
    } else if (suggestion.type === "category") {
      router.push(`/category/${suggestion.slug}`);
    } else {
      router.push(`/tag/${suggestion.slug}`);
    }
  }

  function goSearch() {
    const trimmed = q.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) {
      if (e.key === "Enter") goSearch();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          navigate(suggestions[activeIndex]);
        } else {
          goSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  function getIcon(type: Suggestion["type"]) {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 text-muted flex-shrink-0" />;
      case "category":
        return <Folder className="h-4 w-4 text-accent flex-shrink-0" />;
      case "tag":
        return <Tag className="h-4 w-4 text-primary flex-shrink-0" />;
    }
  }

  function getTypeLabel(type: Suggestion["type"]) {
    switch (type) {
      case "post":
        return "Article";
      case "category":
        return "Category";
      case "tag":
        return "Tag";
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center border border-border-light bg-white">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveIndex(-1);
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-sm bg-transparent outline-none placeholder:text-muted"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
        />
        {isLoading ? (
          <div className="px-4">
            <div className="h-4 w-4 border-2 border-muted border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <button
            type="button"
            onClick={goSearch}
            className={`px-4 py-3 border-l border-border-light transition-colors ${
              q.trim() 
                ? "bg-accent text-white hover:bg-accent-hover" 
                : "bg-bg-secondary text-muted cursor-not-allowed"
            }`}
            disabled={!q.trim()}
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-border-light shadow-dropdown overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.type}-${s.slug}`}
              role="option"
              aria-selected={i === activeIndex}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-border-light last:border-0 ${
                i === activeIndex ? "bg-bg-secondary" : "hover:bg-bg-secondary"
              }`}
              onClick={() => navigate(s)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {getIcon(s.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base truncate">{s.label}</span>
                  <span className="text-2xs uppercase tracking-wider text-muted font-semibold">
                    {getTypeLabel(s.type)}
                  </span>
                </div>
                {s.excerpt && (
                  <p className="text-xs text-secondary truncate mt-0.5">{s.excerpt}...</p>
                )}
              </div>
            </li>
          ))}
          <li className="border-t border-border-light bg-bg-secondary">
            <button
              onClick={goSearch}
              className="w-full px-4 py-3 text-left text-sm text-secondary hover:text-accent transition-colors"
            >
              See all results for "<span className="font-medium text-black">{q}</span>"
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
