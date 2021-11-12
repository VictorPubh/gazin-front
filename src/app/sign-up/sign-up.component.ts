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
import { HobbiesService } from "../peoples/_services/hobbies.service";
import { BehaviorSubject } from "rxjs";
import { HobbyModel } from "../peoples/_models/hobbies/hobby";
import { ModelCompany } from "../company/_models";
import { CompaniesService } from "../company/_services/companies.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  personForm: FormGroup;
  person: PersonModel;

  limitSelection = false;
  selHobbies: Array<HobbyModel> = [];

  disabled: Boolean = false;
  ShowFilter: Boolean = true;
  filedHobbies: Boolean = true;

  isProcessing: Boolean = false;
  error: Boolean = false;

  dropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Selecionar Todos",
    unSelectAllText: "Desmarcar Todos",
    searchPlaceholderText: "Procurar",
    closeDropDownOnSelection: true,
    noDataAvailablePlaceholderText: "Nenhum hobby encontrado.",
    enableCheckAll: false,
    itemsShowLimit: 2,
    allowSearchFilter: this.ShowFilter,
  };

  hobbies$: BehaviorSubject<HobbyModel[]>;
  hobbies: HobbyModel[];

  companies$: BehaviorSubject<ModelCompany[]>;
  companies: ModelCompany[];
  checkField = CheckRequiredField;

  constructor(
    private authService: AuthService,
    private router: Router,
    private peoplesService: PeoplesService,
    private readonly hobbiesService: HobbiesService,
    private readonly companiesService: CompaniesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.hobbies$ = this.hobbiesService.hobbies$;
    this.hobbies = [
      {
        id: 42,
        name: "Programação",
      },
      ...this.hobbies$.getValue(),
    ];

    this.companies$ = this.companiesService.companies$;
    this.companies = this.companies$.getValue();

    console.log(this.companies);

    this.filedHobbies = true;
    this.initForm();
  }

  onItemSelect(item: any) {}

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
