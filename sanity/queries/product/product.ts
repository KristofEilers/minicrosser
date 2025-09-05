import { groq } from "next-sanity";

// Query for a single product with full details
export const PRODUCT_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    productNumber,
    manufacturer->{
      _id,
      name,
      code,
      logo{
        asset->{
          _id,
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
    categories[]->{
      _id,
      name,
      code,
      slug
    },
    shortDescription,
    description,
    features,
    specifications[]{
      name,
      value,
      unit
    },
    variants[]{
      sku,
      name,
      attributes[]{
        name,
        value
      },
      basePrice,
      weight,
      dimensions{
        length,
        width,
        height
      },
      images[]{
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        caption
      },
      stockStatus,
      isActive
    },
    compatibleVehicles[]->{
      _id,
      vehicle->{
        _id,
        manufacturer->{
          name,
          code
        },
        model,
        generation,
        productionYearFrom,
        productionYearTo
      },
      specificEngines,
      position,
      restrictions,
      confidence
    },
    replacesPartNumbers,
    replacedByPartNumbers,
    relatedProducts[]->{
      _id,
      name,
      slug,
      productNumber,
      manufacturer->{
        name,
        code
      },
      variants[0]{
        basePrice,
        images[0]{
          asset->{
            url,
            metadata {
              lqip
            }
          },
          alt
        }
      }
    },
    documents[]->{
      _id,
      title,
      type,
      description,
      language,
      version,
      file{
        asset->{
          url,
          size
        }
      },
      fileSize
    },
    searchKeywords,
    seoTitle,
    seoDescription,
    _updatedAt
  }
`;

// Query for product list/catalog with pagination
export const PRODUCTS_QUERY = groq`
  *[_type == "product" && isActive == true] | order(name asc) [$start..$end] {
    _id,
    name,
    slug,
    productNumber,
    manufacturer->{
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
    }
  }
`;

// Query for product search with filters
export const PRODUCTS_SEARCH_QUERY = groq`
  *[
    _type == "product" && 
    isActive == true &&
    ($searchTerm == "" || 
     name match $searchTerm + "*" || 
     productNumber match $searchTerm + "*" ||
     manufacturer->name match $searchTerm + "*" ||
     searchKeywords match $searchTerm + "*"
    ) &&
    ($manufacturerId == "" || manufacturer._ref == $manufacturerId) &&
    ($categoryId == "" || $categoryId in categories[]._ref)
  ] | order(
    select(
      $searchTerm != "" && name match $searchTerm + "*" => 0,
      $searchTerm != "" && productNumber match $searchTerm + "*" => 1,
      $searchTerm != "" && manufacturer->name match $searchTerm + "*" => 2,
      3
    ),
    name asc
  ) [$start..$end] {
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
    categories[]->{
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
    _score
  }
`;

// Query to get product count for pagination
export const PRODUCTS_COUNT_QUERY = groq`
  count(*[_type == "product" && isActive == true])
`;

// Query for product slugs (for static generation)
export const PRODUCTS_SLUGS_QUERY = groq`
  *[_type == "product" && defined(slug) && isActive == true]{
    slug
  }
`;

// Query for products by category
export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[_type == "product" && isActive == true && $categoryId in categories[]._ref] | order(name asc) [$start..$end] {
    _id,
    name,
    slug,
    productNumber,
    manufacturer->{
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
    }
  }
`;

// Query for products compatible with a specific vehicle
export const PRODUCTS_BY_VEHICLE_QUERY = groq`
  *[_type == "product" && isActive == true && $vehicleId in compatibleVehicles[]->vehicle._ref] | order(name asc) {
    _id,
    name,
    slug,
    productNumber,
    manufacturer->{
      name,
      code
    },
    categories[0]->{
      name,
      code
    },
    variants[0]{
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
    compatibleVehicles[vehicle._ref == $vehicleId][0]{
      position,
      restrictions,
      specificEngines
    }
  }
`;