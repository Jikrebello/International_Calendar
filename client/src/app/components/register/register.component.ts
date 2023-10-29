import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { RegisterUser } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerModel: RegisterUser = new RegisterUser();

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  register(form: NgForm) {
    if (form.valid) {
      this.accountService.register(this.registerModel).subscribe({
        next: () => {
          this.cancel();
        },
      });
    } else {
      if (form.controls["firstName"]?.invalid) {
        this.toastr.error("First Name is required");
      }
      if (form.controls["lastName"]?.invalid) {
        this.toastr.error("Last Name is required");
      }
      if (form.controls["emailAddress"]?.invalid) {
        this.toastr.error("Email Address is required");
      }
      if (form.controls["password"]?.invalid) {
        this.toastr.error("Password is required");
      }
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
