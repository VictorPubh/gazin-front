import { Component, OnInit } from "@angular/core";
import { Observable, Subject, throwError, of, BehaviorSubject } from "rxjs";

import { PeoplesService } from "../_services/peoples.service";
import { PersonModel } from "../_models/person.model";

@Component({
  selector: "app-peoples-list",
  templateUrl: "./peoples-list.component.html",
  styleUrls: ["./peoples-list.component.css"],
})
export class PeoplesListComponent implements OnInit {
  peoples$: BehaviorSubject<PersonModel[]>;

  constructor(private peoplesService: PeoplesService) {}

  ngOnInit() {
    this.peoples$ = this.peoplesService.peoples$;
  }
}
