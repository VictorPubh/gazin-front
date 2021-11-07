import { Component, OnInit, Inject } from "@angular/core";
import {
  Validators,
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validator,
  FormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";

import { CheckRequiredField } from "../_shared/helpers/form.helper";
import { AuthService } from "../_auth/services/auth.service";
import { PersonModel } from "../peoples/_models/person.model";
import { PeoplesService } from "../peoples/_services/peoples.service";
import { HOBBY } from "../hobbies/_models/hobby";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  personForm: FormGroup;
  person: PersonModel;

  limitSelection = false;
  selHobbies: Array<HOBBY> = [];

  disabled: Boolean = false;
  ShowFilter: Boolean = true;
  filedHobbies: Boolean = true;

  isProcessing: Boolean = false;
  error: Boolean = false;

  companies = [
    {
      name: "Gazin",
      id: 1,
    },
  ];

  dropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Selecionar Todos",
    unSelectAllText: "Desmarcar Todos",
    searchPlaceholderText: "Procurar",
    noDataAvailablePlaceholderText: "Nenhum hobby encontrado.",
    enableCheckAll: false,
    itemsShowLimit: 2,
    allowSearchFilter: this.ShowFilter,
  };

  hobbies: HOBBY[];

  checkField = CheckRequiredField;

  constructor(
    private authService: AuthService,
    private router: Router,
    private peoplesService: PeoplesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.hobbies = [
      {
        id: 1,
        name: "Malhar",
        categoryId: 1,
      },
      {
        id: 2,
        name: "Boxe",
        categoryId: 1,
      },
    ];

    this.filedHobbies = true;
  }

  onItemSelect(item: any) {
    console.log("onItemSelect", item);
    console.log("selHobbies", this.selHobbies);
  }

  async onSubmit($event) {
    this.isProcessing = true;
    this.doAddPerson();
  }

  private doAddPerson() {
    console.log("addPerson value:", this.personForm.value);

    this.peoplesService.add(this.personForm.value).subscribe((person) => {
      this.personForm.reset();
      this.isProcessing = false;

      this.router.navigate(["/login"]);
    });
  }

  private initForm() {
    this.personForm = new FormGroup({
      name: new FormControl(this.person ? this.person.name : "", [
        Validators.required,
      ]),
      email: new FormControl(this.person ? this.person.email : "", [
        Validators.required,
        Validators.email,
      ]),
      hobbies: new FormControl([this.selHobbies]),
      password: new FormControl(this.person ? this.person.password : "", [
        Validators.required,
      ]),
      profession: new FormControl(this.person ? this.person.profession : "", [
        Validators.required,
      ]),
      sex: new FormControl(this.person ? this.person.sex : "", [
        Validators.required,
      ]),
      birthday: new FormControl(this.person ? this.person.birthday : "", [
        Validators.required,
      ]),
      company: new FormControl(this.person ? this.person.companyId : null),
    });
  }
}
