import { RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";

import { AuthGuard } from "./_auth/guards/auth.guard";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

/*
 * Routing for the items feature are stored in the items module file
 */

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignUpComponent },
  { path: "logout", component: LogoutComponent },
  { path: "**", redirectTo: "/peoples", pathMatch: "full" },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" }, // catch all route
];
export const routingModule: ModuleWithProviders<any> = RouterModule.forRoot(
  routes,
  { relativeLinkResolution: "legacy" }
);
