import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  Country,
  CountryVisits,
  UserCountryVisitSummary,
} from "../_models/country";
import { BaseResponse, ResultResponse } from "../_models/responses";
import { GUID } from "../_models/types";
import { CountriesEndpoints } from "./../_endpoints/api-endpoints";

@Injectable({
  providedIn: "root",
})
export class CountriesService {
  constructor(private https: HttpClient) {}

  getAllCountries(): Observable<ResultResponse<Country[]>> {
    return this.https.get<ResultResponse<Country[]>>(
      environment.baseUrl + CountriesEndpoints.GET_ALL_COUNTRIES
    );
  }

  getVisitsByUserId(userId: GUID): Observable<ResultResponse<CountryVisits>> {
    return this.https.get<ResultResponse<CountryVisits>>(
      `${environment.baseUrl}${CountriesEndpoints.GET_VISITS_BY_USERID}/${userId}`
    );
  }

  getUserCountryVisitSummary(
    userId: GUID
  ): Observable<ResultResponse<UserCountryVisitSummary[]>> {
    return this.https.get<ResultResponse<UserCountryVisitSummary[]>>(
      `${environment.baseUrl}${CountriesEndpoints.GET_USER_COUNTRY_VISITS_SUMMARY}/${userId}`
    );
  }

  saveCountryVisit(formModel: CountryVisits): Observable<BaseResponse> {
    return this.https.post<BaseResponse>(
      environment.baseUrl + CountriesEndpoints.SAVE_VISITS,
      formModel
    );
  }
}
