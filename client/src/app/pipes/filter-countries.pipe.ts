import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterCountries",
})
export class FilterCountriesPipe implements PipeTransform {
  transform(countries: any[], searchText: string): any[] {
    if (!countries) return [];
    if (!searchText) return countries;

    searchText = searchText.toLowerCase();
    return countries.filter((country) => {
      return country.name.toLowerCase().includes(searchText);
    });
  }
}
