import { groq } from "next-sanity";

// Query for all vehicle models grouped by manufacturer
export const VEHICLES_QUERY = groq`
  *[_type == "manufacturer" && isActive == true] | order(name asc) {
    _id,
    name,
    code,
    "models": *[_type == "vehicleModel" && manufacturer._ref == ^._id && isActive == true] | order(model asc, productionYearFrom desc) {
      _id,
      model,
      generation,
      bodyType,
      productionYearFrom,
      productionYearTo,
      engines[]{
        code,
        displacement,
        power,
        fuelType
      },
      chassis,
      image{
        asset->{
          url,
          metadata {
            lqip
          }
        }
      }
    }
  }
`;

// Query for a single vehicle model with compatible products
export const VEHICLE_QUERY = groq`
  *[_type == "vehicleModel" && _id == $vehicleId][0]{
    _id,
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
    model,
    generation,
    bodyType,
    productionYearFrom,
    productionYearTo,
    engines[]{
      code,
      displacement,
      power,
      fuelType
    },
    chassis,
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
    "compatibleProducts": *[_type == "product" && isActive == true && $vehicleId in compatibleVehicles[]->vehicle._ref] | order(name asc) {
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
      },
      compatibleVehicles[vehicle._ref == $vehicleId][0]{
        position,
        restrictions,
        specificEngines,
        confidence
      }
    }
  }
`;

// Query for vehicle compatibility search
export const VEHICLE_COMPATIBILITY_QUERY = groq`
  *[
    _type == "vehicleModel" && 
    isActive == true &&
    ($manufacturerId == "" || manufacturer._ref == $manufacturerId) &&
    ($model == "" || model match $model + "*") &&
    ($yearFrom == null || productionYearFrom <= $yearFrom) &&
    ($yearTo == null || !defined(productionYearTo) || productionYearTo >= $yearTo)
  ] | order(manufacturer->name asc, model asc, productionYearFrom desc) [0..49] {
    _id,
    manufacturer->{
      _id,
      name,
      code
    },
    model,
    generation,
    bodyType,
    productionYearFrom,
    productionYearTo,
    engines[0]{
      code,
      displacement,
      fuelType
    },
    "productCount": count(*[_type == "product" && ^._id in compatibleVehicles[]->vehicle._ref && isActive == true])
  }
`;

// Query for popular vehicle models (most products compatible)
export const POPULAR_VEHICLES_QUERY = groq`
  *[_type == "vehicleModel" && isActive == true] {
    _id,
    manufacturer->{
      name,
      code
    },
    model,
    generation,
    productionYearFrom,
    productionYearTo,
    "productCount": count(*[_type == "product" && ^._id in compatibleVehicles[]->vehicle._ref && isActive == true])
  } | order(productCount desc) [0..11] | productCount > 0
`;