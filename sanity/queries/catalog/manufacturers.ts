import { groq } from "next-sanity";

// Query for all active manufacturers
export const MANUFACTURERS_QUERY = groq`
  *[_type == "manufacturer" && isActive == true] | order(name asc) {
    _id,
    name,
    code,
    slug,
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
    },
    description,
    website,
    "productCount": count(*[_type == "product" && manufacturer._ref == ^._id && isActive == true])
  }
`;

// Query for a single manufacturer with products
export const MANUFACTURER_QUERY = groq`
  *[_type == "manufacturer" && slug.current == $slug][0]{
    _id,
    name,
    code,
    slug,
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
    },
    description,
    website,
    "products": *[_type == "product" && manufacturer._ref == ^._id && isActive == true] | order(name asc) [0..11] {
      _id,
      name,
      slug,
      productNumber,
      shortDescription,
      variants[0]{
        sku,
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
    "totalProducts": count(*[_type == "product" && manufacturer._ref == ^._id && isActive == true])
  }
`;

// Query for manufacturer slugs
export const MANUFACTURERS_SLUGS_QUERY = groq`
  *[_type == "manufacturer" && defined(slug) && isActive == true]{
    slug
  }
`;