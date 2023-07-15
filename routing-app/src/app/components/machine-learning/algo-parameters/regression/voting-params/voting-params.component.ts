import { Component, EventEmitter, Output, } from '@angular/core';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-voting-params',
  templateUrl: './voting-params.component.html',
  styleUrls: ['./voting-params.component.css']
})
export class VotingParamsComponent {

  @Output() valueChange = new EventEmitter<any>()

  paramsData = [
    {
      algo_id: null,
      algo_params: {},
    },
    {
      algo_id: null,
      algo_params: {},
    }
  ]

  constructor() { }

  ngOnInit(){
    this.onChange()
  }

  onChange(){
    this.valueChange.emit(cloneDeep(this.paramsData)) 
  }

  addChild(){
    this.paramsData.push({
      algo_id: null,
      algo_params: {
      },
    })
  }

  deleteChild(index: number){
    this.paramsData.splice(index, 1)
    this.onChange()
  }

  onAlgoChange(i:number, event:any){
    this.paramsData[i].algo_id = event.value
  }

  onParamsChange(i:number, newValue: any){
    this.paramsData[i].algo_params = newValue
    this.onChange()
  }
}
