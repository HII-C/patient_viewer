import {Component, Injectable} from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {SmartService} from '../services/smart.service';


@Injectable()
export class FhirService {
    constructor(private smartService: SmartService) {
        console.log("FhirService created...");
    }
    private base: string;
    private token: string;

    getUrl(): string {
        return this.base;
    }

    setUrl(url: string) {
        this.base = url;
    }

    setToken(newToken: string) {
      this.token = newToken;
    }

    options2(): RequestOptions {
        let headers = new Headers();
        headers.append('Accept', 'application/json');

        return new RequestOptions({ headers: headers });
    }
    options(): RequestOptions {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Authentication', 'Bearer '+ this.smartService.token);

        return new RequestOptions({ headers: headers });
    }

}
