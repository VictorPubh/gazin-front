import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, Subject, throwError, of, BehaviorSubject } from "rxjs";
import { map, mergeMap, switchMap, catchError, tap } from "rxjs/operators";

import { PersonModel } from "../_models/person.model";
import { AddDeveloperModel } from "../_models/add-person.model";
import { UpdatePersonModel } from "../_models/update-person.model";

import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PeoplesService {
  // Create a BehaviourSubject Observable with type PersonModel[] and default value []
  peoples$ = new BehaviorSubject<PersonModel[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  clear(): void {
    this.peoples$.next([]);
  }

  getAll(): PersonModel[] {
    return this.peoples$.getValue();
  }

  getToken(): string {
    return localStorage.getItem("token");
  }

  get(id: number): PersonModel {
    const currentItems: PersonModel[] = this.getAll();
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
      .delete(environment["apiBaseUrl"] + "/person/" + id, {
        headers: new HttpHeaders().set(
          "Authorization",
          `Bearer ${this.getToken()}`
        ),
      })
      .pipe(
        map((person) => {
          return person["id"] ? true : false;
        }),
        tap((success) => {
          if (success) {
            this.deletePerson(id);
          }
        }), // when success, delete the item from the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  fetchPerson(id: number): Observable<any> {
    return this.http.get(environment["apiBaseUrl"] + "/person/" + id).pipe(
      map((person) => {
        return person["id"] ? person : false;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  update(id: number, payload: UpdatePersonModel): Observable<any> {
    return this.http
      .put(environment["apiBaseUrl"] + "/person/" + id, payload, {
        headers: new HttpHeaders().set(
          "Authorization",
          `Bearer ${this.getToken()}`
        ),
      })
      .pipe(
        map((person) => {
          return person["id"] ? person : false;
        }),
        tap((person: PersonModel) => {
          if (person) {
            this.updatePerson(id, person);
          }
        }), // when success result, update the item in the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  add(payload: AddDeveloperModel): Observable<any> {
    return this.http.post(environment["apiBaseUrl"] + "/person", payload).pipe(
      map((person) => {
        return person["id"] ? person : false;
      }),
      tap((person: PersonModel) => {
        if (person) {
          this.addPerson(person);
        }
      }), // when success, add the item to the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  deletePerson(id: number): boolean {
    const currentItems: PersonModel[] = this.getAll();
    if (currentItems.length > 0) {
      const indexOne = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (indexOne >= 0) {
        currentItems.splice(indexOne, 1);
        this.peoples$.next(currentItems);
        return true;
      }
    }

    return false;
  }

  addPerson(person: PersonModel): void {
    const currentItems: PersonModel[] = this.getAll();
    currentItems.push(person);
    this.peoples$.next(currentItems);
  }

  updatePerson(id: number, person: PersonModel): boolean {
    const currentItems: PersonModel[] = this.getAll();
    if (currentItems.length > 0) {
      const indexOne = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (indexOne >= 0) {
        currentItems[indexOne] = person;
        this.peoples$.next(currentItems);
        this.router.navigate(["/peoples"]);
        return true;
      }
    }

    return false;
  }

  fetch(): Observable<any> {
    this.clear();

    return this.http.get(environment["apiBaseUrl"] + "/peoples").pipe(
      map((data) => {
        return data ? data : [];
      }),
      tap((peoples: PersonModel[]) => {
        if (peoples.length > 0) {
          this.peoples$.next(peoples);
        }
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
