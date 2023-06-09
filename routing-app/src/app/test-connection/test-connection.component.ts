import { Component, OnInit } from '@angular/core';
import { select, Store } from "@ngrx/store";

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestConnectionService } from '../services/test-connection-services';
import { TestConnectionActions } from './store/actions';
import { TestConnectionState } from './store/states';




@Component({
  selector: 'app-test-connection',
  templateUrl: './test-connection.component.html',
  styleUrls: ['./test-connection.component.css'],
})


export class TestConnectionComponent  implements OnInit {
  apiUrl: string;
  httpClient: HttpClient;

  constructor(httpClient: HttpClient,
    private testConnectionServices: TestConnectionService,
    private testConnectionStore: Store<TestConnectionState>
    ) {
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
      const url = this.apiUrl + 'connect'
      console.log(data)
      console.log(url)
      return this.httpClient.post(
        url,
        data,
        this.getHttpHeader()
      ).subscribe(x =>{console.log(x)}
      );
      
  }

  public getQueryTest(userId: string) {
    // const url = this.apiUrl + ApiConfig.FACEBOOK_FEED_PATH
    const url = this.apiUrl + '/getDataset'
    console.log(userId)
    console.log(url)
    return this.httpClient.post(
      url,
      userId,
      this.getHttpHeader()
    ).subscribe(x =>{console.log(x)}
    );
    
}

  connect() {
    alert("connecting")
    // this.testConnectionServices.sendTest('{"sss":"ssss"}')
    // this.testConnectionStore.dispatch(TestConnectionActions.insertNewDataInit({data: '{"Hello":"Jia Hao"}'}))
    this.getQueryTest('{"user_id": "6435575578b04a2b1549c17b"}')
    console.log("runnnn")

  }
}
