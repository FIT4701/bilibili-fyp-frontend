
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { BasicApiResponseModel } from "../models/api-models/api-response-model";
import { Injectable } from "@angular/core";
import { DatabaseModel } from "../models/store-models/database.model";
// import { Injectable } from "@angular/core";


@Injectable({providedIn: "root"})
export class TestConnectionService {

    apiUrl: string;
    httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.apiUrl = 'http://127.0.0.1:5000/'
        this.httpClient = httpClient;
    }

    public getHttpHeader() {
      console.log("www")
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        return httpOptions;
    }
    
    public sendTest(data: string){
        // const url = this.apiUrl + ApiConfig.FACEBOOK_FEED_PATH
        const url = this.apiUrl + "/connect"
        console.log(data)
        console.log(url)
        return this.httpClient.post(
          url,
          data,
          this.getHttpHeader()
        );
        
    }




}