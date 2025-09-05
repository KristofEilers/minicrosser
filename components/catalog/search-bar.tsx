"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/useDebounce";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (term: string) => void;
  showSuggestions?: boolean;
};

export default function SearchBar({ 
  placeholder = "Search products, part numbers, manufacturers...", 
  onSearch,
  showSuggestions = false 
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("q") || "");
  const [suggestions, setSuggestions] = useState<any>({});
  const [showingSuggestions, setShowingSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Handle search submission
  const handleSearch = useCallback((term: string) => {
    if (onSearch) {
      onSearch(term);
    } else {
      const params = new URLSearchParams(searchParams?.toString());
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      router.push(`/catalog/search?${params.toString()}`);
    }
    setShowingSuggestions(false);
  }, [onSearch, router, searchParams]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowingSuggestions(false);
    if (!onSearch) {
      router.push("/catalog");
    }
  };

  // Fetch suggestions when search term changes
  useEffect(() => {
    if (!showSuggestions || !debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      setSuggestions({});
      setShowingSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedSearchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowingSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm, showSuggestions]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-12"
            onFocus={() => Object.keys(suggestions).length > 0 && setShowingSuggestions(true)}
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search button for mobile */}
        <Button type="submit" className="sr-only">
          Search
        </Button>
      </form>

      {/* Suggestions dropdown */}
      {showingSuggestions && showSuggestions && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-2">Searching...</span>
            </div>
            </div>
          ) : Object.keys(suggestions).length > 0 ? (
            <div className="py-2">
              {suggestions.products?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Products
                  </div>
                  {suggestions.products.map((product: any) => (
                    <button
                      key={product.slug.current}
                      onClick={() => {
                        router.push(`/catalog/product/${product.slug.current}`);
                        setShowingSuggestions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.manufacturer.name} • {product.productNumber}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.manufacturers?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t">
                    Manufacturers
                  </div>
                  {suggestions.manufacturers.map((manufacturer: any) => (
                    <button
                      key={manufacturer.slug.current}
                      onClick={() => {
                        router.push(`/catalog/manufacturer/${manufacturer.slug.current}`);
                        setShowingSuggestions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium text-sm">{manufacturer.name}</div>
                      <div className="text-xs text-gray-500">{manufacturer.code}</div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.categories?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t">
                    Categories
                  </div>
                  {suggestions.categories.map((category: any) => (
                    <button
                      key={category.slug.current}
                      onClick={() => {
                        router.push(`/catalog/category/${category.slug.current}`);
                        setShowingSuggestions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.code}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}