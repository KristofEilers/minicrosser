import { groq } from "next-sanity";

// Global search across products with ranking
export const GLOBAL_SEARCH_QUERY = groq`
  *[
    _type == "product" && 
    isActive == true &&
    ($searchTerm == "" || 
     name match $searchTerm + "*" || 
     productNumber match $searchTerm + "*" ||
     manufacturer->name match $searchTerm + "*" ||
     variants[].sku match $searchTerm + "*" ||
     searchKeywords match $searchTerm + "*" ||
     replacesPartNumbers match $searchTerm + "*"
    )
  ] | order(
    select(
      name match $searchTerm + "*" => 0,
      productNumber match $searchTerm + "*" => 1,
      variants[].sku match $searchTerm + "*" => 2,
      manufacturer->name match $searchTerm + "*" => 3,
      replacesPartNumbers match $searchTerm + "*" => 4,
      searchKeywords match $searchTerm + "*" => 5,
      6
    ),
    name asc
  ) [0..49] {
    _id,
    name,
    slug,
    productNumber,
    manufacturer->{
      _id,
      name,
      code,
      logo{
        asset->{
          url,
          metadata {
            lqip
          }
        }
      }
    },
    categories[0]->{
      _id,
      name,
      code
    },
    shortDescription,
    variants[0]{
      sku,
      basePrice,
      stockStatus,
      images[0]{
        asset->{
          url,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
      }
    },
    "matchType": select(
      name match $searchTerm + "*" => "name",
      productNumber match $searchTerm + "*" => "productNumber",
      variants[].sku match $searchTerm + "*" => "sku",
      manufacturer->name match $searchTerm + "*" => "manufacturer",
      replacesPartNumbers match $searchTerm + "*" => "partNumber",
      searchKeywords match $searchTerm + "*" => "keyword",
      "other"
    )
  }
`;

// Search suggestions/autocomplete
export const SEARCH_SUGGESTIONS_QUERY = groq`
  {
    "products": *[
      _type == "product" && 
      isActive == true &&
      (name match $searchTerm + "*" || productNumber match $searchTerm + "*")
    ] | order(name asc) [0..4] {
      name,
      productNumber,
      slug,
      manufacturer->{
        name,
        code
      }
    },
    "manufacturers": *[
      _type == "manufacturer" && 
      isActive == true &&
      name match $searchTerm + "*"
    ] | order(name asc) [0..3] {
      name,
      code,
      slug
    },
    "categories": *[
      _type == "productCategory" && 
      isActive == true &&
      name match $searchTerm + "*"
    ] | order(name asc) [0..3] {
      name,
      code,
      slug
    }
  }
`;

// Search filters for faceted search
export const SEARCH_FILTERS_QUERY = groq`
  {
    "manufacturers": *[
      _type == "manufacturer" && 
      isActive == true &&
      count(*[_type == "product" && manufacturer._ref == ^._id && isActive == true]) > 0
    ] | order(name asc) {
      _id,
      name,
      code,
      "productCount": count(*[_type == "product" && manufacturer._ref == ^._id && isActive == true])
    },
    "categories": *[
      _type == "productCategory" && 
      isActive == true &&
      count(*[_type == "product" && ^._id in categories[]._ref && isActive == true]) > 0
    ] | order(name asc) {
      _id,
      name,
      code,
      parent->{
        _id,
        name
      },
      "productCount": count(*[_type == "product" && ^._id in categories[]._ref && isActive == true])
    }
  }
`;

// Part number lookup (exact match)
export const PART_NUMBER_LOOKUP_QUERY = groq`
  *[
    _type == "product" && 
    isActive == true &&
    (
      productNumber == $partNumber ||
      variants[].sku == $partNumber ||
      replacesPartNumbers match $partNumber
    )
  ] | order(
    select(
      productNumber == $partNumber => 0,
      variants[].sku == $partNumber => 1,
      2
    )
  ) [0..9] {
    _id,
    name,
    slug,
    productNumber,
    manufacturer->{
      name,
      code
    },
    variants[sku == $partNumber || productNumber == $partNumber][0]{
      sku,
      basePrice,
      stockStatus,
      images[0]{
        asset->{
          url,
          metadata {
            lqip
          }
        },
        alt
      }
    },
    "matchType": select(
      productNumber == $partNumber => "exact",
      variants[].sku == $partNumber => "variant",
      "replacement"
    )
  }
`;