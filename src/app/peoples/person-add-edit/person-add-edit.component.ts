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
import { HobbyModel } from "../_models/hobbies/hobby";
import { ModelCompany } from "src/app/company/_models";
import { CompaniesService } from "src/app/company/_services/companies.service";
import { HobbiesService } from "../_services/hobbies.service";

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
  filedHobbies: Boolean = false;

  hobbies$: BehaviorSubject<HobbyModel[]>;
  hobbies: HobbyModel[];
  selectedsHobbies: HobbyModel[];

  companies$: BehaviorSubject<ModelCompany[]>;
  companies: ModelCompany[];

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
    allowSearchFilter: false,
  };

  checkField = CheckRequiredField;

  constructor(
    private readonly peoplesService: PeoplesService,
    private readonly companiesService: CompaniesService,
    private readonly hobbiesService: HobbiesService
  ) {}

  async ngOnInit() {
    this.initForm();

    await this.companiesService.fetch().subscribe(() => {
      this.companies$ = this.companiesService.companies$;
      this.companies = this.companies$.getValue();
      this.selectedsHobbies = this.person?.hobbies;
    });

    await this.hobbiesService.fetch().subscribe(() => {
      this.hobbies$ = this.hobbiesService.hobbies$;
      this.hobbies = this.hobbies$.getValue();
    });

    this.filedHobbies = true;
  }

  onItemSelect(item: any) {}

  onSubmit($event) {
    this.isProcessing = true;

    if (this.personForm.valid) {
      if (!this.person) {
        this.doAddPerson();
      } else {
        this.doUpdatePerson();
      }
    }

    console.log(this.personForm.value);

    this.peoplesService.fetch().subscribe();
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
        hobbies: new FormControl(this.person ? this.selectedsHobbies : []),
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
        hobbies: new FormControl(this.person ? this.selectedsHobbies : []),
        profession: new FormControl(
          this.person ? this.person.profession : "Developer",
          [Validators.required]
        ),
        sex: new FormControl(this.person ? this.person.sex : "", [
          Validators.required,
        ]),
        birthday: new FormControl(
          this.person ? new Date(this.person.birthday).toISOString() : "",
          [Validators.required]
        ),
        company: new FormControl(this.person ? this.person.companyId : null),
      });
    }
  }
}
