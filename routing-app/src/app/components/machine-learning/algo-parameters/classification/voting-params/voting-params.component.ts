import { Component, EventEmitter, Output, } from '@angular/core';
import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-cls-voting-params',
  templateUrl: './voting-params.component.html',
  styleUrls: ['./voting-params.component.css']
})
export class VotingParamsComponent {

  @Output() valueChange = new EventEmitter<any>()

  algo_params: any = {
    voting_params: {
      voting: 'hard',
    },
    estimators_list : [
      {
        algo_id: null,
        algo_params: {},
      },
      {
        algo_id: null,
        algo_params: {},
      }
    ],
  }
 

  constructor() { }

  ngOnInit(){
    this.onChange()
  }

  onChange(){
    this.valueChange.emit(cloneDeep(this.algo_params)) 
  }

  addChild(){
    this.algo_params.estimators_list.push({
      algo_id: null,
      algo_params: {
      },
    })
  }

  deleteChild(index: number){
    this.algo_params.estimators_list.splice(index, 1)
    this.onChange()
  }

  onAlgoChange(i:number, event:any){
    console.log(event)
    this.algo_params.estimators_list[i].algo_id = event.value
    this.algo_params.estimators_list[i].algo_params = {}
    this.onChange()
  }

  onEstimatorParamsChange(i:number, newValue: any){
    this.algo_params.estimators_list[i].algo_params = newValue
    this.onChange()
  }
}
