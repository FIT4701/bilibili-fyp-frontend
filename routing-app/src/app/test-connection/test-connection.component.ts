import { Component, OnInit } from '@angular/core';
// import { select, Store } from "@ngrx/store";
import {TestConnectionService} from '../../../../routing-app/src/app/test-connection/test-connection.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-test-connection',
  templateUrl: './test-connection.component.html',
  styleUrls: ['./test-connection.component.css']
})


export class TestConnectionComponent  implements OnInit {
  apiUrl: string;
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
      this.apiUrl = 'http://127.0.0.1:5000/'
      this.httpClient = httpClient;
  }
  

  ngOnInit(): void {
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
  
  public sendTest(data: string) {
      // const url = this.apiUrl + ApiConfig.FACEBOOK_FEED_PATH
      const url = this.apiUrl + '/connect'
      console.log(data)
      console.log(url)
      return this.httpClient.post(
        url,
        data,
        this.getHttpHeader()
      ).subscribe(x =>{console.log(x)}
      );
      
  }



  connect() {
    alert("connecting")
    this.sendTest("sss")
    console.log("runnnn")

  }
}
