import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map, of } from "rxjs";
import { MlWekaService } from "src/app/services/ml-weka-service";
import { WekaMLActions } from "../actions";

@Injectable()
export class WekaMLEffects{
    constructor(
        private action$: Actions,
        private MlWekaService: MlWekaService){
        }

    wekaMLAlgoInit$ = createEffect(() =>
        this.action$.pipe(
            ofType(WekaMLActions.wekaMLAlgoInit),
            concatMap(action => {
                return this.MlWekaService.runMlAlgorithm(action.request_params)
                .pipe(
                    map(result => {
                        if (result != null){
                            console.log(result)
                            return WekaMLActions.wekaMLAlgoSuccess({data: result})
                        }
                        else {
                            return WekaMLActions.wekaMLAlgoFailed({error: result})
                        }
                    }),
                    catchError((error) => of(WekaMLActions.wekaMLAlgoFailed({error:error})))
                )
            })
        ))
}