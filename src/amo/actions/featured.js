import {
  FEATURED_GET,
  FEATURED_LOADED,
  FEATURED_FAILED,
} from 'core/constants';


export function getFeatured({ addonType }) {
  if (!addonType) {
    throw new Error('addonType must be set');
  }

  return {
    type: FEATURED_GET,
    payload: { addonType },
  };
}

export function loadFeatured({ addonType, entities, result }) {
  return {
    type: FEATURED_LOADED,
    payload: { addonType, entities, result },
  };
}

export function failFeatured({ addonType }) {
  return {
    type: FEATURED_FAILED,
    payload: { addonType },
  };
}
