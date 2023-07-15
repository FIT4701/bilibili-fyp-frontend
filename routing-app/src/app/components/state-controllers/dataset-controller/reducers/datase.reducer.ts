import { DatasetActions } from "../actions";
import { DatasetState, initialDatasetState } from "../states/dataset.state";

export function DatasetReducer(
  state: DatasetState = initialDatasetState,
  action: any
): DatasetState {
  switch (action.type) {
    case DatasetActions.LOAD_SELECTED_DATASET_SUCCESS:
      return {
        ...state,
        // modify properties here
        selectedDataset: action.data,
        selectedFeatures: null

      };
    // more actions
    case DatasetActions.LOAD_SELECTED_DATASET_FAILED:
      return {
        ...state,
        // modify properties here
      };
    case DatasetActions.LOAD_SELECTED_FEATURES_SUCCESS:
      return {
        ...state,
        // modify properties here
        selectedFeatures: action.data

      };
    // more actions
    case DatasetActions.LOAD_SELECTED_FEATURES_FAILED:
      return {
        ...state,
        // modify properties here
      };
    default:
      return state;
  }
}