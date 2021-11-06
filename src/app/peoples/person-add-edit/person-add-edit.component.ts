import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  Validators,
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validator,
  FormsModule,
} from "@angular/forms";
import { Observable, Subject, Subscription, BehaviorSubject } from "rxjs";
import { CheckRequiredField } from "../../_shared/helpers/form.helper";

import { PeoplesService } from "../_services/peoples.service";
import { PersonModel } from "../_models/person.model";

@Component({
  selector: "app-person-add-edit",
  templateUrl: "./person-add-edit.component.html",
  styleUrls: ["./person-add-edit.component.css"],
})
export class PersonAddEditComponent implements OnInit {
  @Input() person: PersonModel;
  @Input() isEdit: boolean;
  @Output() formSubmitEvent = new EventEmitter<string>();

  personForm: FormGroup;

  isProcessing: Boolean = false;

  companies = [
    {
      name: "Gazin",
      id: 1,
    },
  ];

  checkField = CheckRequiredField;

  constructor(private peoplesService: PeoplesService) {}

  ngOnInit() {
    this.initForm();
  }

  onSubmit($event) {
    this.isProcessing = true;

    if (this.personForm.valid) {
      if (!this.person) {
        this.doAddPerson();
      } else {
        this.doUpdatePerson();
      }
    }
  }

  getButtonText(): string {
    return this.person ? "Atualizar" : "Adicionar";
  }

  private doAddPerson() {
    this.peoplesService.add(this.personForm.value).subscribe((result) => {
      this.personForm.reset();
      this.formSubmitEvent.next("add");
      this.isProcessing = false;
    });
  }

  private doUpdatePerson() {
    this.peoplesService
      .update(this.personForm.value.id, this.personForm.value)
      .subscribe((result) => {
        if (result) {
          this.formSubmitEvent.next("update");
          this.reset();
        }
        this.isProcessing = false;
      });
  }

  private reset() {
    this.person = null;
    this.personForm.reset();
    this.initForm();
  }

  private initForm() {
    if (this.isEdit) {
      this.personForm = new FormGroup({
        id: new FormControl(this.person ? this.person.id : "", [
          Validators.required,
        ]),
        name: new FormControl(this.person ? this.person.name : "", [
          Validators.required,
        ]),
        email: new FormControl(this.person ? this.person.email : "", [
          Validators.email,
        ]),
        profession: new FormControl(
          this.person ? this.person.profession : "Developer",
          [Validators.required]
        ),
        sex: new FormControl(this.person ? this.person.sex : "", [
          Validators.required,
        ]),
        company: new FormControl(this.person ? this.person.companyId : null),
      });
    } else {
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
        company: new FormControl(this.person ? this.person.companyId : null),
      });
    }
  }
}
