export interface ICountry {
  id: number;
  name: string;
}

export class Country implements ICountry {
  id!: number;
  name!: string;
}

export interface ICountryVisits {
  userId: string;
  selectedCountries: { [key: string]: string[] };
}

export class CountryVisits implements ICountryVisits {
  userId!: string;
  selectedCountries!: { [key: string]: string[] };
}

export interface IUserCountryVisitSummary {
  userId: string;
  countryId: number;
  countryName: string;
  visitCount: number;
}

export class UserCountryVisitSummary implements IUserCountryVisitSummary {
  userId!: string;
  countryId!: number;
  countryName!: string;
  visitCount!: number;
}
