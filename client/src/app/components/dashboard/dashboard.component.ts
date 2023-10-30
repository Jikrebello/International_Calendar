import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { UserCountryVisitSummary } from "src/app/_models/country";
import { User } from "src/app/_models/user";
import { CountriesService } from "./../../_services/countries.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private countriesService: CountriesService,
    private toastr: ToastrService
  ) {}
  private _user!: User;
  public userCountryVisitSummaries: UserCountryVisitSummary[] = [];

  ngOnInit(): void {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString) as User;
      this._user = user;
    }

    this.countriesService.getUserCountryVisitSummary(this._user.id).subscribe({
      next: (response) => {
        this.userCountryVisitSummaries = response.result;
      },
      error: (error) => {
        this.toastr.error(error.message, "Error");
      },
    });
  }
}
