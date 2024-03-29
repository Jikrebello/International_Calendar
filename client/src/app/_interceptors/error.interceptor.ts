import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              this.toastr.error(error.error.message, error.status.toString());
              break;

            case 401:
              this.toastr.error("Unauthorized", error.status.toString());
              break;

            case 404:
              this.router.navigateByUrl("/not-found");
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error.result },
              };
              this.toastr.error(error.error.message, error.status.toString());
              this.router.navigateByUrl("/server-error", navigationExtras);
              break;

            default:
              this.toastr.error("Something unexpected went wrong.");
              console.log(error);
              break;
          }
        }
        return throwError(() => error);
      })
    );
  }
}
