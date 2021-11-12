import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { PeoplesService } from "../_services/peoples.service";
import { PersonModel } from "../_models/person.model";

@Component({
  selector: "app-person-edit",
  templateUrl: "./person-edit.component.html",
  styleUrls: ["./person-edit.component.css"],
})
export class PersonEditComponent implements OnInit, OnDestroy {
  personForm: FormGroup;
  person: PersonModel;

  id: number = null;

  readyView: Boolean = false;
  hasFetched: Boolean = false;
  hasNoItem: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private peoplesService: PeoplesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resolveRoute();
  }

  ngOnDestroy() {}

  resolveRoute() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.id = +params["id"];
        this.getPerson();
      } else {
        this.handlePersonNotFound();
      }
    });
  }

  formSubmitEvent($event) {
    if ($event) {
      switch ($event) {
        case "update": {
          this.router.navigate(["/peoples"]);
          break;
        }
        case "add": {
          break;
        }
      }
    }
  }

  private getPerson() {
    const person = this.peoplesService.get(this.id);
    if (person) {
      this.initForm(person);
    } else {
      if (!this.hasFetched) {
        console.log("Cannot find in local store, trying remote store.");
        this.fetchPerson();
      } else {
        console.log(
          "Cannot find in local store and remote store and again in local store!"
        );
        this.handlePersonNotFound();
      }
    }
  }

  private handlePersonNotFound() {
    this.readyView = true;
    this.hasNoItem = true;
    console.log("* I GIVE UP *");
  }

  private fetchPerson() {
    this.hasFetched = true;
    this.peoplesService.fetchPerson(this.id).subscribe((result) => {
      if (result) {
        this.initForm(result);
      } else {
        console.log(
          "Cannot find in local store and remote store, trying again in local store"
        );
        this.getPerson();
      }
    });
  }

  private initForm(person: PersonModel) {
    console.log("** Uoba! found the item **");
    this.person = person;
    this.readyView = true;
    this.personForm = new FormGroup({
      name: new FormControl(this.person ? this.person.name : "", [
        Validators.required,
      ]),
      email: new FormControl(this.person ? this.person.email : "", [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.person ? this.person.password : "", [
        Validators.required,
      ]),
      profession: new FormControl(
        this.person ? this.person.profession : "Developer",
        [Validators.required]
      ),
      sex: new FormControl(this.person ? this.person.sex : "", [
        Validators.required,
      ]),
      birthday: new FormControl(this.person ? this.person.birthday : "", [
        Validators.required,
      ]),
      company: new FormControl(this.person ? this.person.companyId : 0),
    });
  }
}
