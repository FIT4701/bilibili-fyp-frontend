import {createFeatureSelector, createSelector} from "@ngrx/store";
import { DatasetState } from "../states/dataset.state";

export const selectedDatasetState = createFeatureSelector<DatasetState>("datasetReducers");
export const selectDataset = createSelector(
    selectedDatasetState,
    state => state.selectedDataset
)
export const selectFeatures = createSelector(
    selectedDatasetState,
    state => state.selectedFeatures
)