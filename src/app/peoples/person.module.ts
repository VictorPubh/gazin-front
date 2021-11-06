import { AuthGuard } from "../_auth/guards/auth.guard";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { PersonAddEditComponent } from "./person-add-edit/person-add-edit.component";
import { PersonEditComponent } from "./person-edit/person-edit.component";
import { PeoplesListItemComponent } from "./peoples-list-item/peoples-list-item.component";
import { PeoplesListComponent } from "./peoples-list/peoples-list.component";
import { PeoplesComponent } from "./person.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

const routes: Routes = [
  { path: "peoples", component: PeoplesComponent, canActivate: [AuthGuard] },
  {
    path: "person-edit/:id",
    component: PersonEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
  ],
  declarations: [
    PeoplesComponent,
    PeoplesListComponent,
    PeoplesListItemComponent,
    PersonEditComponent,
    PersonAddEditComponent,
  ],
})
export class PeoplesModule {}
