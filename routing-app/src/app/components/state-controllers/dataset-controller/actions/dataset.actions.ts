import { createAction, props } from "@ngrx/store";

export const LOAD_SELECTED_DATASET_INIT = '[Selected Dataset Loading Effect] Load New Dataset Init'
export const LOAD_SELECTED_DATASET_SUCCESS = '[Selected Dataset Loading Effect] Load New Dataset Success'
export const LOAD_SELECTED_DATASET_FAILED = '[Selected Dataset Loading Effect] Load New Dataset Failed'

export const LOAD_SELECTED_FEATURES_INIT = '[Selected Features Loading Effect] Load New Features Init'
export const LOAD_SELECTED_FEATURES_SUCCESS = '[Selected Features Loading Effect] Load New Features Success'
export const LOAD_SELECTED_FEATURES_FAILED = '[Selected Features Loading Effect] Load New Features Failed'


export const loadSelectedDatasetInit = createAction(
    LOAD_SELECTED_DATASET_INIT,
    props<{data: any}>()
);

export const loadSelectedDatasetSuccess = createAction(
    LOAD_SELECTED_DATASET_SUCCESS,
    props<{data: string}>()
);

export const loadSelectedDatasetFailed = createAction(
    LOAD_SELECTED_DATASET_FAILED,
    props<{error: any}>()
);

export const loadSelectedFeatureInit = createAction(
    LOAD_SELECTED_FEATURES_INIT,
    props<{data: any}>()
);

export const loadSelectedFeatureSuccess = createAction(
    LOAD_SELECTED_FEATURES_SUCCESS,
    props<{data: string}>()
);

export const loadSelectedFeatureFailed = createAction(
    LOAD_SELECTED_FEATURES_FAILED,
    props<{error: any}>()
);