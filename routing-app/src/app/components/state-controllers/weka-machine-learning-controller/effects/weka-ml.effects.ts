import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map, of } from "rxjs";
import { MlWekaService } from "src/app/services/ml-weka-service";
import { WekaMLActions } from "../actions";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class WekaMLEffects{
    constructor(
        private action$: Actions,
        private MlWekaService: MlWekaService,
        private toaster: ToastrService){
        }

    wekaMLAlgoInit$ = createEffect(() =>
        this.action$.pipe(
            ofType(WekaMLActions.wekaMLAlgoInit),
            concatMap(action => {
                return this.MlWekaService.runMlAlgorithm(action.request_params)
                .pipe(
                    map(result => {
                        if (result != null){

                            if (result.error != null) {
                                this.toaster.error(
                                    result.error
                                  );
                                return WekaMLActions.wekaMLAlgoFailed({error: result})
                                
                            }

                            console.log(result)
                            this.toaster.success('Successfully Run');
                            return WekaMLActions.wekaMLAlgoSuccess({data: result})
                        }
                        else {
                            this.toaster.error(
                                "Internal Server Error"
                              );
                            return WekaMLActions.wekaMLAlgoFailed({error: result})
                        }
                    }),
                    catchError((error) => of(WekaMLActions.wekaMLAlgoFailed({error:error})))
                )
            })
        ))
}