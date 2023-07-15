import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface DatasetState {
    selectedDataset: any
    selectedFeatures: any
}

export const connectionAdapter = createEntityAdapter({
})

export const initialDatasetState = connectionAdapter.getInitialState({
    selectedDataset: null,
    selectedFeatures: null
})