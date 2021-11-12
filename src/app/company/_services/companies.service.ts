import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, Subject, throwError, of, BehaviorSubject } from "rxjs";
import { map, mergeMap, switchMap, catchError, tap } from "rxjs/operators";

import { Router } from "@angular/router";
import { ModelCompany } from "../_models";

@Injectable({
  providedIn: "root",
})
export class CompaniesService {
  // Create a BehaviourSubject Observable with type HobbyModel[] and default value []
  companies$ = new BehaviorSubject<ModelCompany[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  clear(): void {
    this.companies$.next([]);
  }

  getAll(): ModelCompany[] {
    return this.companies$.getValue();
  }

  getToken(): string {
    return localStorage.getItem("token");
  }

  get(id: number): ModelCompany {
    const currentItems: ModelCompany[] = this.getAll();
    if (currentItems.length === 0) {
      return null;
    }

    const firstIndex = currentItems.findIndex((element) => {
      return element.id === id;
    });
    return firstIndex >= 0 && currentItems[firstIndex]
      ? currentItems[firstIndex]
      : null;
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete(environment["apiBaseUrl"] + "/company/" + id, {
        headers: new HttpHeaders().set(
          "Authorization",
          `Bearer ${this.getToken()}`
        ),
      })
      .pipe(
        map((company) => {
          return company["id"] ? true : false;
        }),
        tap((success) => {
          if (success) {
            this.deleteCompany(id);
          }
        }), // when success, delete the item from the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  fetchCompany(id: number): Observable<any> {
    return this.http.get(environment["apiBaseUrl"] + "/company/" + id).pipe(
      map((company) => {
        return company["id"] ? company : false;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  update(id: number, payload: ModelCompany): Observable<any> {
    return this.http
      .put(environment["apiBaseUrl"] + "/company/" + id, payload, {
        headers: new HttpHeaders().set(
          "Authorization",
          `Bearer ${this.getToken()}`
        ),
      })
      .pipe(
        map((company) => {
          return company["id"] ? company : false;
        }),
        tap((company: ModelCompany) => {
          if (company) {
            this.updateCompany(id, company);
          }
        }), // when success result, update the item in the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  add(payload: ModelCompany): Observable<any> {
    return this.http.post(environment["apiBaseUrl"] + "/company", payload).pipe(
      map((company) => {
        return company["id"] ? company : false;
      }),
      tap((company: ModelCompany) => {
        if (company) {
          this.addCompany(company);
        }
      }), // when success, add the item to the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  deleteCompany(id: number): boolean {
    const currentItems: ModelCompany[] = this.getAll();
    if (currentItems.length > 0) {
      const indexOne = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (indexOne >= 0) {
        currentItems.splice(indexOne, 1);
        this.companies$.next(currentItems);
        return true;
      }
    }

    return false;
  }

  addCompany(company: ModelCompany): void {
    const currentItems: ModelCompany[] = this.getAll();
    currentItems.push(company);
    this.companies$.next(currentItems);
  }

  updateCompany(id: number, company: ModelCompany): boolean {
    const currentItems: ModelCompany[] = this.getAll();
    if (currentItems.length > 0) {
      const indexOne = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (indexOne >= 0) {
        currentItems[indexOne] = company;
        this.companies$.next(currentItems);
        this.router.navigate(["/company"]);
        return true;
      }
    }

    return false;
  }

  fetch(): Observable<any> {
    this.clear();

    return this.http.get(environment["apiBaseUrl"] + "/company").pipe(
      map((data) => {
        return data ? data : [];
      }),
      tap((companies: ModelCompany[]) => {
        if (companies.length > 0) {
          this.companies$.next(companies);
        }
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
