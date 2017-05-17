import {Component, Injectable} from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {SmartService} from '../services/smart.service';


@Injectable()
export class FhirService {

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

    options(auth): RequestOptions {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        if(auth) {
          headers.append('Authorization', 'Bearer '+ this.token);
        }
        return new RequestOptions({ headers: headers });
    }


}
