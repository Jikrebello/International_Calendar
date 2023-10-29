import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { ResultResponse } from "../_models/responses";
import { GUID } from "../_models/types";
import { EditUser, LoginUser, RegisterUser, User } from "../_models/user";
import { UsersEndpoints } from "./../_endpoints/api-endpoints";
import { BaseResponse } from "./../_models/responses";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<
    User | ResultResponse<User> | null
  >(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private https: HttpClient) {}

  login(model: LoginUser) {
    return this.https
      .post<ResultResponse<User>>(
        environment.baseUrl + UsersEndpoints.LOGIN,
        model
      )
      .pipe(
        map((response: ResultResponse<User>) => {
          if (response && response.result) {
            localStorage.setItem("user", JSON.stringify(response.result));
            this.currentUserSource.next(response);
            return response;
          } else {
            return null;
          }
        })
      );
  }

  register(model: RegisterUser) {
    return this.https
      .post<ResultResponse<User>>(
        environment.baseUrl + UsersEndpoints.REGISTER,
        model
      )
      .pipe(
        map((response: ResultResponse<User>) => {
          if (response && response.result) {
            localStorage.setItem("user", JSON.stringify(response.result));
            this.currentUserSource.next(response);
          }
        })
      );
  }

  getUserById(userId: GUID): Observable<ResultResponse<User>> {
    return this.https.get<ResultResponse<User>>(
      `${environment.baseUrl}${UsersEndpoints.GET_BY_ID}/${userId}`
    );
  }

  editUser(model: EditUser): Observable<BaseResponse> {
    return this.https.post<BaseResponse>(
      environment.baseUrl + UsersEndpoints.EDIT_USER,
      model
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
