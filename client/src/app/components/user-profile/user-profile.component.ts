import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BaseResponse } from "src/app/_models/responses";
import { EditUser, User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent {
  formModel: EditUser = new EditUser();

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString) as User;
      this.formModel.id = user.id;
    }

    this.accountService.getUserById(this.formModel.id).subscribe({
      next: (response) => {
        this.formModel.firstName = response.result.firstName;
        this.formModel.lastName = response.result.lastName;
        this.formModel.bio = response.result.bio;
      },
    });
  }

  submit(): void {
    this.accountService.editUser(this.formModel).subscribe({
      next: (response: BaseResponse) => {
        this.toastr.success(response.message, "Success");
        this.router.navigateByUrl("/dashboard");
      },
      error: (error) => {
        console.error("An error occurred: ", error);
      },
    });
  }
}
