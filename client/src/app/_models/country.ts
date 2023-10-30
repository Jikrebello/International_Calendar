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

export class CountryVisits {
  userId!: string;
  selectedCountries!: { [key: string]: string[] };
}
