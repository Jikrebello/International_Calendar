import { Component } from "@angular/core";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent {
  weeks: (number | null)[][] = [];
  currentDate = new Date();
  currentMonth!: string;
  currentYear!: number;
  selectedCountry: string = "";
  showModal: boolean = false;
  modalStyle = {};
  selectedCountries: { [key: string]: string } = {};
  currentClickedDay: number | null = null;

  constructor() {
    this.generateCalendar(this.currentDate);
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
    this.currentClickedDay = day;
    if (day) {
      const dateString = `${this.currentYear}-${
        this.currentDate.getMonth() + 1
      }-${day}`;
      this.selectedCountry = this.selectedCountries[dateString] || "";
      this.showModal = true;
    }
  }

  saveCountry(): void {
    if (this.currentClickedDay) {
      const dateString = `${this.currentYear}-${
        this.currentDate.getMonth() + 1
      }-${this.currentClickedDay}`;
      this.selectedCountries[dateString] = this.selectedCountry;
    }
    this.showModal = false;
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
