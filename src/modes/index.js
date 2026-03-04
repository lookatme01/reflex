export {
  flickConfig,
  createFlickState,
  handleFlickClick,
  updateFlick,
  getFlickResults,
} from "./flick";

export {
  popConfig,
  createPopState,
  handlePopClick,
  updatePop,
  getPopResults,
} from "./pop";

export {
  trackingConfig,
  createTrackingState,
  handleTrackingMouseMove,
  updateTracking,
  getTrackingResults,
} from "./tracking";

export {
  gridshotConfig,
  createGridshotState,
  handleGridshotClick,
  updateGridshot,
  getGridshotResults,
} from "./gridshot";

export const MODES = {
  flick: {
    key: "flick",
    config: null, // filled below
    create: null,
    handleClick: null,
    update: null,
    getResults: null,
  },
  pop: {
    key: "pop",
    config: null,
    create: null,
    handleClick: null,
    update: null,
    getResults: null,
  },
  tracking: {
    key: "tracking",
    config: null,
    create: null,
    handleClick: null,
    handleMouseMove: null,
    update: null,
    getResults: null,
  },
  gridshot: {
    key: "gridshot",
    config: null,
    create: null,
    handleClick: null,
    update: null,
    getResults: null,
  },
};

// Wire up — done this way to keep imports clean
import {
  flickConfig as fc,
  createFlickState,
  handleFlickClick,
  updateFlick,
  getFlickResults,
} from "./flick";
import {
  popConfig as pc,
  createPopState,
  handlePopClick,
  updatePop,
  getPopResults,
} from "./pop";
import {
  trackingConfig as tc,
  createTrackingState,
  handleTrackingMouseMove,
  updateTracking,
  getTrackingResults,
} from "./tracking";
import {
  gridshotConfig as gc,
  createGridshotState,
  handleGridshotClick,
  updateGridshot,
  getGridshotResults,
} from "./gridshot";

Object.assign(MODES.flick, {
  config: fc,
  create: createFlickState,
  handleClick: handleFlickClick,
  update: updateFlick,
  getResults: getFlickResults,
});

Object.assign(MODES.pop, {
  config: pc,
  create: createPopState,
  handleClick: handlePopClick,
  update: updatePop,
  getResults: getPopResults,
});

Object.assign(MODES.tracking, {
  config: tc,
  create: createTrackingState,
  handleClick: null,
  handleMouseMove: handleTrackingMouseMove,
  update: updateTracking,
  getResults: getTrackingResults,
});

Object.assign(MODES.gridshot, {
  config: gc,
  create: createGridshotState,
  handleClick: handleGridshotClick,
  update: updateGridshot,
  getResults: getGridshotResults,
});
