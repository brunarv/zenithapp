import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ZenithService {

  private zenithUrl = '/api/';

  constructor(private http: Http) { }

  getZenith(): Promise<any[]> {
    return this.http.get(this.zenithUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? '${error.status} - ${error.statusText}' : 'Server error';
      console.error(errMsg);
  }

}
