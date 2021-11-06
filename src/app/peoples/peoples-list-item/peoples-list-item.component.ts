import { Router } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";
import { PersonModel } from "../_models/person.model";
import { PeoplesService } from "../_services/peoples.service";

import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";

@Component({
  selector: "app-peoples-list-item",
  templateUrl: "./peoples-list-item.component.html",
  styleUrls: ["./peoples-list-item.component.css"],
})
export class PeoplesListItemComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;

  sexOptions = {
    male: "Homem",
    female: "Mulher",
    undefined: "Não definido",
  };

  @Input() person: PersonModel;
  birthday: string;
  personSex: string;
  createdAt: string;

  constructor(private peoplesService: PeoplesService, private router: Router) {}

  ngOnInit() {
    this.birthday = moment(this.person.birthday).format("DD/MM/YYYY");
    this.createdAt = moment(this.person.createdAt).format(
      "DD/MM/YYYY HH:mm:ss"
    );
    this.personSex = this.sexOptions[this.person.sex];
    // console.log(this.person);
  }

  edit() {
    this.router.navigate(["/person-edit/" + this.person.id]);
  }

  delete() {
    this.peoplesService.delete(this.person.id).subscribe();
  }
}
