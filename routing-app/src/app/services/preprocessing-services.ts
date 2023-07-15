import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({providedIn: "root"})
export class PreprocssingService {

    apiUrl: string;
    httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.apiUrl = 'http://127.0.0.1:5000/'
        this.httpClient = httpClient;
    }

    public getHttpHeader() {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        return httpOptions;
    }
    
    public getResponseData(id_user: any, id_dataset: any){
        const url = this.apiUrl + '/get-data'
        const request_body = {
            user_id: id_user,
            DATASET_ID: id_dataset
          }

        return this.httpClient.post<any>(
          url,
          request_body,
          this.getHttpHeader()
        )
        
    }

    public runPreprocessing(dataset_id: string, preprocessing_code: string, selection?: any, variables?: string[]){
        const url = this.apiUrl + '/preprocessing'
        const request_body = {
            DATASET_ID: dataset_id, 
            preprocessing_code: preprocessing_code,
            params: selection, 
            variables: variables,
          }
        console.log(request_body)

        return this.httpClient.post<any>(
          url,
          request_body,
          this.getHttpHeader()
        )
        
    }
}