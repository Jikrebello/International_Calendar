import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Country, CountryVisits } from "src/app/_models/country";
import { BaseResponse } from "src/app/_models/responses";
import { User } from "src/app/_models/user";
import { CountriesService } from "./../../_services/countries.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  weeks: (number | null)[][] = [];
  currentDate = new Date();
  currentMonth!: string;
  currentYear!: number;
  selectedCountry: string = "";
  showModal: boolean = false;
  modalStyle = {};
  currentClickedDay: number | null = null;
  selectedCountriesForDay: string[] = [];
  selectedCountries: { [key: string]: string[] } = {};
  countries: Country[] = [];
  filterText = "";
  formModel: CountryVisits = new CountryVisits();

  constructor(
    private countriesService: CountriesService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.generateCalendar(this.currentDate);
  }

  ngOnInit(): void {
    this.countriesService.getAllCountries().subscribe({
      next: (response) => {
        this.countries = response.result;
      },
    });

    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString) as User;
      this.formModel.userId = user.id;
    }

    this.getVisits();
  }

  generateCalendar(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    this.currentMonth = date.toLocaleString("default", { month: "long" });
    this.currentYear = date.getFullYear();

    this.weeks = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week: number[] = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > lastDay) {
          week.push(0);
        } else {
          week.push(day++);
        }
      }
      this.weeks.push(week);
    }

    if (this.weeks[this.weeks.length - 1].every((value) => value === 0)) {
      this.weeks.pop();
    }
  }

  isToday(day: number | null): boolean {
    if (day === null) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  onDayClick(day: number | null): void {
    if (day !== 0) {
      const dateString = `${this.currentYear}-${String(
        this.currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      this.currentClickedDay = day;
      this.selectedCountriesForDay = [
        ...(this.selectedCountries[dateString] || []),
      ];

      this.showModal = true;
    }
  }

  saveCountry(): void {
    if (this.currentClickedDay) {
      const dateString = `${this.currentYear}-${String(
        this.currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(this.currentClickedDay).padStart(2, "0")}`;

      // Create a new instance of the selectedCountries object
      const updatedCountries = { ...this.selectedCountries };
      // Use a Set to ensure uniqueness for the selected day's countries
      updatedCountries[dateString] = [...new Set(this.selectedCountriesForDay)];
      this.selectedCountries = updatedCountries;

      this.formModel.selectedCountries = this.selectedCountries;

      this.countriesService.saveCountryVisit(this.formModel).subscribe({
        next: (response: BaseResponse) => {
          this.toastr.success(response.message, "Success");
          this.getVisits();
        },
        error: (error: any) => {
          this.toastr.error(error.message, "Error");
          console.error("An error occurred: ", error);
        },
      });
    }
    this.showModal = false;
    this.selectedCountriesForDay = [];
  }

  getVisits(): void {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString) as User;

      this.countriesService.getVisitsByUserId(user.id).subscribe({
        next: (response) => {
          this.selectedCountries = response.result.selectedCountries;
          this.cdr.detectChanges();
          this.toastr.success("Loaded user visits successfully.", "Success");
          console.log(this.selectedCountries);
        },
        error: (error: any) => {
          this.toastr.error(error.message, "Error");
          console.error(
            "An error occurred while fetching user visits: ",
            error
          );
        },
      });
    } else {
      this.toastr.error("User not found in local storage.", "Error");
    }
  }

  isSelected(country: string): boolean {
    return this.selectedCountriesForDay.includes(country);
  }

  toggleSelection(country: string): void {
    if (this.isSelected(country)) {
      this.selectedCountriesForDay = this.selectedCountriesForDay.filter(
        (c) => c !== country
      );
    } else {
      this.selectedCountriesForDay = [...this.selectedCountriesForDay, country];
    }
  }

  hasVisit(year: number, month: number, day: number | null): boolean {
    if (day) {
      const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      return !!this.selectedCountries[dateString];
    }
    return false;
  }

  getCountryForDate(year: number, month: number, day: number | null): string {
    if (day) {
      const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const countries = this.selectedCountries[dateString];
      if (countries && countries.length) {
        return countries.join(", "); // Join countries with a comma
      }
    }
    return "No Country";
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar(this.currentDate);
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar(this.currentDate);
  }
}
