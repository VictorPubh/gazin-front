import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, Subject, throwError, of, BehaviorSubject } from "rxjs";
import { map, mergeMap, switchMap, catchError, tap } from "rxjs/operators";

import { HobbyModel } from "../_models/hobbies/hobby";

import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class HobbiesService {
  hobbies$ = new BehaviorSubject<HobbyModel[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  clear(): void {
    this.hobbies$.next([]);
  }

  getAll(): HobbyModel[] {
    return this.hobbies$.getValue();
  }

  getToken(): string {
    return localStorage.getItem("token");
  }

  get(id: number): HobbyModel {
    const currentItems: HobbyModel[] = this.getAll();
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
      .delete(environment["apiBaseUrl"] + "/hobby/" + id, {
        headers: new HttpHeaders().set(
          "Authorization",
          `Bearer ${this.getToken()}`
        ),
      })
      .pipe(
        map((hobby) => {
          return hobby["id"] ? true : false;
        }),
        tap((success) => {
          if (success) {
            this.deleteHobby(id);
          }
        }), // when success, delete the item from the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  fetchHobby(id: number): Observable<any> {
    return this.http.get(environment["apiBaseUrl"] + "/hobby/" + id).pipe(
      map((hobby) => {
        return hobby["id"] ? hobby : false;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  update(id: number, payload: HobbyModel): Observable<any> {
    return this.http
      .put(environment["apiBaseUrl"] + "/hobby/" + id, payload, {
        headers: new HttpHeaders().set(
          "Authorization",
          `Bearer ${this.getToken()}`
        ),
      })
      .pipe(
        map((hobby) => {
          return hobby["id"] ? hobby : false;
        }),
        tap((hobby: HobbyModel) => {
          if (hobby) {
            this.updateHobby(id, hobby);
          }
        }), // when success result, update the item in the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  add(payload: HobbyModel): Observable<any> {
    return this.http.post(environment["apiBaseUrl"] + "/hobby", payload).pipe(
      map((hobby) => {
        return hobby["id"] ? hobby : false;
      }),
      tap((hobby: HobbyModel) => {
        if (hobby) {
          this.addHobby(hobby);
        }
      }), // when success, add the item to the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  deleteHobby(id: number): boolean {
    const currentItems: HobbyModel[] = this.getAll();
    if (currentItems.length > 0) {
      const indexOne = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (indexOne >= 0) {
        currentItems.splice(indexOne, 1);
        this.hobbies$.next(currentItems);
        return true;
      }
    }

    return false;
  }

  addHobby(hobby: HobbyModel): void {
    const currentItems: HobbyModel[] = this.getAll();
    currentItems.push(hobby);
    this.hobbies$.next(currentItems);
  }

  updateHobby(id: number, hobby: HobbyModel): boolean {
    const currentItems: HobbyModel[] = this.getAll();
    if (currentItems.length > 0) {
      const indexOne = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (indexOne >= 0) {
        currentItems[indexOne] = hobby;
        this.hobbies$.next(currentItems);
        this.router.navigate(["/hobby"]);
        return true;
      }
    }

    return false;
  }

  fetch(): Observable<any> {
    this.clear();

    return this.http.get(environment["apiBaseUrl"] + "/hobby").pipe(
      map((data) => {
        return data ? data : [];
      }),
      tap((peoples: HobbyModel[]) => {
        if (peoples.length > 0) {
          this.hobbies$.next(peoples);
        }
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
