import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { SEARCH_SUGGESTIONS_QUERY } from "@/sanity/queries/catalog/search";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], manufacturers: [], categories: [] });
    }

    const suggestions = await client.fetch(SEARCH_SUGGESTIONS_QUERY, { 
      searchTerm: q 
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}