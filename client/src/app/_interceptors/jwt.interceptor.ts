import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../_models/user";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const userString = localStorage.getItem("user");
    let user: User | null = null;
    let token: string | null = null;

    if (userString) {
      user = JSON.parse(userString) as User;
      token = user.token;
    }
    if (token) {
      const clonedRequest = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${token}`),
      });

      return next.handle(clonedRequest);
    } else {
      return next.handle(request);
    }
  }
}
