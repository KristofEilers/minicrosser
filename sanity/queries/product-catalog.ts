import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const productCatalogQuery = groq`
  _type == "product-catalog" => {
    _type,
    _key,
    title,
    subtitle,
    showSearch,
    showCategories,
    showManufacturers,
    productsPerPage,
    featuredCategories[]->{
      _id,
      name,
      slug
    },
    featuredManufacturers[]->{
      _id,
      name,
      slug
    },
    padding,
    colorVariant,
  }
`;