import { Component, OnInit } from "@angular/core";
import { PersonModel } from "../peoples/_models/person.model";
import { AuthService } from "../_auth/services/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  person: PersonModel;
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.person = await this.fetchUser();
  }

  async fetchUser() {
    return this.authService.getUserData();
  }
}
