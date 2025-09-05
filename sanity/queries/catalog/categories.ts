import { groq } from "next-sanity";

// Query for all categories with hierarchy
export const CATEGORIES_QUERY = groq`
  *[_type == "productCategory" && isActive == true] | order(sortOrder asc, name asc) {
    _id,
    name,
    code,
    slug,
    description,
    image{
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
    parent->{
      _id,
      name,
      code,
      slug
    },
    "children": *[_type == "productCategory" && parent._ref == ^._id && isActive == true] | order(sortOrder asc, name asc) {
      _id,
      name,
      code,
      slug,
      description,
      image{
        asset->{
          url,
          metadata {
            lqip
          }
        }
      }
    },
    "productCount": count(*[_type == "product" && ^._id in categories[]._ref && isActive == true])
  }
`;

// Query for root categories only
export const ROOT_CATEGORIES_QUERY = groq`
  *[_type == "productCategory" && !defined(parent) && isActive == true] | order(sortOrder asc, name asc) {
    _id,
    name,
    code,
    slug,
    description,
    image{
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
    "children": *[_type == "productCategory" && parent._ref == ^._id && isActive == true] | order(sortOrder asc, name asc) {
      _id,
      name,
      code,
      slug,
      image{
        asset->{
          url,
          metadata {
            lqip
          }
        }
      },
      "productCount": count(*[_type == "product" && ^._id in categories[]._ref && isActive == true])
    },
    "productCount": count(*[_type == "product" && ^._id in categories[]._ref && isActive == true])
  }
`;

// Query for a single category with breadcrumbs and products
export const CATEGORY_QUERY = groq`
  *[_type == "productCategory" && slug.current == $slug][0]{
    _id,
    name,
    code,
    slug,
    description,
    image{
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
    parent->{
      _id,
      name,
      code,
      slug,
      parent->{
        _id,
        name,
        code,
        slug
      }
    },
    "children": *[_type == "productCategory" && parent._ref == ^._id && isActive == true] | order(sortOrder asc, name asc) {
      _id,
      name,
      code,
      slug,
      description,
      image{
        asset->{
          url,
          metadata {
            lqip
          }
        }
      },
      "productCount": count(*[_type == "product" && ^._id in categories[]._ref && isActive == true])
    },
    "products": *[_type == "product" && ^._id in categories[]._ref && isActive == true] | order(name asc) [0..11] {
      _id,
      name,
      slug,
      productNumber,
      manufacturer->{
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
              lqip
            }
          },
          alt
        }
      }
    },
    "totalProducts": count(*[_type == "product" && ^._id in categories[]._ref && isActive == true]),
    seoTitle,
    seoDescription
  }
`;

// Query for category slugs
export const CATEGORIES_SLUGS_QUERY = groq`
  *[_type == "productCategory" && defined(slug) && isActive == true]{
    slug
  }
`;