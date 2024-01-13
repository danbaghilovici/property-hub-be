export class PropertiesFiltersDto {
    skip:number;
    take:number;
    propertyType: PropertyType;
    propertyStatus: PropertyType[];
    price: Price;
    city: PropertyType;
    zipCode: string;
    neighborhood: Neighborhood[];
    street: Street[];
    bedrooms: Bedrooms;
    bathrooms: Bedrooms;
    garages: Bedrooms;
    area: Price;
    yearBuilt: Price;
    features: Feature[];
    fromAgent: number;
}
export class Feature {
    id: number;
    name: string;
    selected: boolean;
}
export class Bedrooms {
    from: number;
    to: number;
}
export class Street {
    id: number;
    name: string;
    cityId: number;
    neighborhoodId: number;
}
export class Neighborhood {
    id: number;
    name: string;
    cityId: number;
}
export class Price {
    from: number;
    to: number;
}
export class PropertyType {
    id: number;
    name: string;
}
