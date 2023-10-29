import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import { ResultResponse } from "src/app/_models/responses";
import { LoginUser, User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  userModel?: User = new User();
  currentUser$: Observable<User | ResultResponse<User> | null> = of(null);
  formModel: LoginUser = new LoginUser();

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;

    const userString = localStorage.getItem("user");
    if (userString) {
      this.userModel = JSON.parse(userString) as User;
    }
  }

  login(form: NgForm) {
    if (form.valid) {
      this.accountService.login(this.formModel).subscribe({
        next: (response) => {
          this.userModel = response?.result as User;
          this.router.navigateByUrl("/dashboard");
        },
      });
    } else {
      if (form.controls["emailAddress"]?.invalid) {
        this.toastr.error("Email is required");
      }
      if (form.controls["password"]?.invalid) {
        this.toastr.error("Password is required");
      }
    }
  }

  logOut() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }
}
