import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { routingModule } from "./app.routing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { APP_BASE_HREF } from "@angular/common";

import { AppComponent } from "./app.component";
import { UiModule } from "./_shared/ui/ui.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "./_auth/guards/auth.guard";
import { TokenIntercept } from "./_auth/tokenintercept";

import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { PeoplesModule } from "./peoples/person.module";
import { PeoplesService } from "./peoples/_services/peoples.service";
import { AuthService } from "./_auth/services/auth.service";
import { SignUpComponent } from "./sign-up/sign-up.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LogoutComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    UiModule,
    HttpClientModule,
    RouterModule,
    routingModule,
    ReactiveFormsModule,
    FormsModule,
    PeoplesModule,
    FontAwesomeModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/" },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenIntercept,
      multi: true,
    },
    AuthService,
    PeoplesService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
