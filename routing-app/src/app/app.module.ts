import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EffectsModule} from "@ngrx/effects";
import { TestConnectionComponent } from './test-connection/test-connection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { appReducer} from './test-connection/store/reducers/test-connection.reducer';
import { TestConnectionEffects} from './test-connection/store/effects/test-connection.effects'
import { MaterialModule } from './material/material.module';
import { NavigationTemplateComponentComponent } from './navigation-template-component/navigation-template-component.component';
import { HomeComponent } from './components/home/home.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { PreprocessingComponent } from './components/preprocessing/preprocessing.component';
import { AgGridModule } from 'ag-grid-angular';
import { MachineLearningComponent } from './components/machine-learning/machine-learning.component';
import { ResultsComponent } from './components/results/results.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DatasetEffects } from './components/state-controllers/dataset-controller/effects/dataset.effects';
import { DatasetReducer } from './components/state-controllers/dataset-controller/reducers/datase.reducer';
import { WekaMLEffects } from './components/state-controllers/weka-machine-learning-controller/effects/weka-ml.effects';
import { WekaMLReducer } from './components/state-controllers/weka-machine-learning-controller/reducers/weka-ml.reducers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { ToolbarComponent } from './components/utilities/toolbar/toolbar.component';
import { DeleteCellRendererComponent } from './components/utilities/delete-cell-renderer/delete-cell-renderer.component';

import { DecisionTreesParamsComponent as RegrDecisionTreesParamsComponent } from './components/machine-learning/algo-parameters/regression/decision-trees-params/decision-trees-params.component';
import { KnnParamsComponent as RegrKnnParamsComponent} from './components/machine-learning/algo-parameters/regression/knn-params/knn-params.component';
import { RandomForestParamsComponent as RegrRandomForestParamsComponent } from './components/machine-learning/algo-parameters/regression/random-forest-params/random-forest-params.component';
import { BaggingParamsComponent as RegrBaggingParamsComponent } from './components/machine-learning/algo-parameters/regression/bagging-params/bagging-params.component';
import { VotingParamsComponent as RegrVotingParamsComponent } from './components/machine-learning/algo-parameters/regression/voting-params/voting-params.component';
import { FeatureSelectionComponent } from './components/preprocessing/feature-selection/feature-selection.component';
import { SelectKBestComponent } from './components/preprocessing/feature-selection/selection-algo-param/select-k-best/select-k-best.component';
import { DecisionTreesParamsComponent as ClsDecisionTreesParamsComponent} from './components/machine-learning/algo-parameters/classification/decision-trees-params/decision-trees-params.component';
import { RandomForestParamsComponent as ClsRandomForestParamsComponent} from './components/machine-learning/algo-parameters/classification/random-forest-params/random-forest-params.component';
import { KnnParamsComponent as ClsKnnParamsComponent } from './components/machine-learning/algo-parameters/classification/knn-params/knn-params.component';
import { VotingParamsComponent as ClsVotingParamsComponent } from './components/machine-learning/algo-parameters/classification/voting-params/voting-params.component';
import { WarningPopupComponent } from './components/machine-learning/warning-popup/warning-popup.component';
import { ArcgisComponent } from './components/arcgis/arcgis.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from "ngx-toastr";
import { WrapperComponent } from './components/preprocessing/feature-selection/selection-algo-param/wrapper/wrapper.component';


@NgModule({
  declarations: [
    AppComponent,
    TestConnectionComponent,
    NavigationTemplateComponentComponent,
    HomeComponent,
    DatasetComponent,
    PreprocessingComponent,
    MachineLearningComponent,
    ResultsComponent,
    AnalysisComponent,
    ToolbarComponent,
    DeleteCellRendererComponent,
    RegrDecisionTreesParamsComponent,
    RegrKnnParamsComponent,
    RegrRandomForestParamsComponent,
    RegrBaggingParamsComponent,
    RegrVotingParamsComponent,
    FeatureSelectionComponent,
    SelectKBestComponent,
    ClsDecisionTreesParamsComponent,
    ClsKnnParamsComponent,
    ClsRandomForestParamsComponent,
    ClsVotingParamsComponent,
    WarningPopupComponent,
    ArcgisComponent,
    WrapperComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ testConnectionReducers:  appReducer, datasetReducers: DatasetReducer, wekaMLReducers: WekaMLReducer }),
    // StoreModule.forRoot({ applicationState: connectionReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
    ToastrModule.forRoot(),
    EffectsModule.forRoot([TestConnectionEffects, DatasetEffects, WekaMLEffects]),
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
