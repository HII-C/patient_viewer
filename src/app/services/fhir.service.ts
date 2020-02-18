import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class FhirService {

  constructor() { }

  private base: string;
  public token: string;

  getUrl(): string {
    return this.base;
  }

  setUrl(url: string) {
    this.base = url;
  }

  setToken(newToken: string) {
    this.token = newToken;
  }

  getRequestOptions(withAuth: boolean = true): { headers: HttpHeaders } {
    return {
      headers:
        new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
    };
  }

  // Remove eventually
  options(auth): RequestOptions {
    let headers = new Headers();
    headers.append('Accept', 'application/json');

    if (auth) {
      headers.append('Authorization', 'Bearer ' + this.token);
    }

    return new RequestOptions({ headers: headers });
  }
}