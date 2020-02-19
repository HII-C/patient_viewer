import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

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
    let headers = new HttpHeaders({'Accept': 'application/json'});
    if (withAuth) {
      headers = headers.append('Authorization', 'Bearer ' + this.token);
    }
    return { headers: headers };
  }
}