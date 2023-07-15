import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestConnectionComponent } from './test-connection/test-connection.component';
import { HomeComponent } from './components/home/home.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { PreprocessingComponent } from './components/preprocessing/preprocessing.component';
import { MachineLearningComponent } from './components/machine-learning/machine-learning.component';
import { ResultsComponent } from './components/results/results.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { FeatureSelectionComponent } from './components/preprocessing/feature-selection/feature-selection.component';
import { ArcgisComponent } from './components/arcgis/arcgis.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dataset', component: DatasetComponent },
  { path: 'preprocessing', component: PreprocessingComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'machine-learning', component: MachineLearningComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'test-connection-component', component: TestConnectionComponent },
  { path: 'feature-selection', component: FeatureSelectionComponent },
  { path: 'arcgis', component: ArcgisComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
