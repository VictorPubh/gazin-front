import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, Subject, throwError, of, BehaviorSubject } from "rxjs";
import { map, mergeMap, switchMap, catchError, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { PersonModel } from "src/app/peoples/_models/person.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isLoggedIn = new BehaviorSubject(false);

  onLogin = new Subject<any>(); // Deprecated
  onLogout = new Subject<any>(); // Deprecated

  private token: string = null;
  private userData: PersonModel = null;

  constructor(private http: HttpClient) {
    // Try and find out if there was a localstorage token was set
    this.resolveToken();
  }

  async validateTokenOnServer() {
    return await this.http
      .post(environment["apiBaseUrl"] + "/auth/validate-token", {
        jwt: this.getToken(),
      })
      .pipe(
        map((data) => {
          return data["id"] ? data["id"] : false;
        }),
        tap((status) => {
          if (status) {
            this.userData = status["id"];
          } else {
            this.isLoggedIn.next(false);
            localStorage.removeItem("token");
          }
        }),
        catchError((err) => {
          return of(false);
        })
      );
  }

  // check if localstorage token was set
  // if so, set the token in the service
  // and set the login status
  resolveToken(): boolean {
    this.token = localStorage.getItem("token");
    this.isLoggedIn.next(this.token ? true : false);
    return this.token ? true : false;
  }

  getToken(): string {
    return this.token;
  }

  hasToken(): boolean {
    return localStorage.getItem("token") || this.token ? true : false;
  }

  async logout() {
    // clear any current data
    this.clearData();

    // tell the rest of the application about the logout
    this.isLoggedIn.next(false);
    return true;

    // return this.http
    //   .get(environment["apiBaseUrl"] + "/api/auth/logout")
    //   .toPromise()
    //   .then(
    //     () => {
    //       // clear any current data
    //       this.clearData();

    //       // tell the rest of the application about the logout
    //       this.isLoggedIn.next(false);
    //       return true;
    //     },
    //     (err) => {
    //       return false;
    //     }
    //   );
  }

  async login({ email, password }): Promise<any> {
    // Clear some data
    this.clearData();

    // Create the payload data for the api request
    const loginData = {
      email: email,
      password: password,
    };

    const headerDict = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    const data = await this.http
      .post(
        environment["apiBaseUrl"] + "/auth/login",
        loginData,
        requestOptions
      )
      .toPromise();

    console.log(data);

    // This part only gets executed when the promise is resolved
    if (data["acess_token"] && data["user"]) {
      this.setDataAfterLogin(data);
      this.isLoggedIn.next(true); // how do I unit test this?

      return data["user"];
    } else {
      return false;
    }
  }

  clearData() {
    this.userData = null;
    this.token = null;
    localStorage.clear();
  }

  getUserData(): PersonModel {
    return this.userData;
  }

  private setDataAfterLogin(data) {
    this.token = data["acess_token"];

    // store some user data in the service
    this.userData = data["user"];

    // store some data in local storage (webbrowser)
    localStorage.setItem("token", this.token);
    localStorage.setItem("usermeta", JSON.stringify(this.userData));
  }
}
