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

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  personForm: FormGroup;
  person: PersonModel;

  isProcessing: Boolean = false;
  error: Boolean = false;

  companies = [
    {
      name: "Gazin",
      id: 1,
    },
  ];

  checkField = CheckRequiredField;

  constructor(
    private authService: AuthService,
    private router: Router,
    private peoplesService: PeoplesService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  async onSubmit($event) {
    this.isProcessing = true;
    this.doAddPerson();
  }

  private doAddPerson() {
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
