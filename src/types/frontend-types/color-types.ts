export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export enum Colors {
  PEACH_ACTIVE = "#765246",
  PEACH_PRIMARY = "#C6A094",
  STEEL_GREY_PRIMARY = "#4F6786",
  PEACH_FOCUS = "#F3CCD0",
  STEEL_GREY_TEXT = "#051222",
  DANGER_RED = "#D06A64",
  DANGER_OPAQUE = "#F3CCD0",
  WARNING_YELLOW = "#F0CA45",
  WARNING_YELLOW_DARK = "#9D7F13",
  SUCCESS_OPAQUE = "#B8EDAD",
  INFO_DARK = "#102F57",
  WARNING_OPAQUE = "#F7F4B0",
  SUCCESS_DARK = "#456D3D",
  DANGER_DARK = "#A82E26",
  INFO_OPAQUE = "#BBD5F1",
  SUCCESS_GREEN = "#6FAB63",
  DANGER_ROYAL = "#BE4941",
  DANGER_LIGHT = "#DD9693",
  SUCCESS_LIGHT = "#8AD17C",
  SUCCESS_ROYAL = "#5C9452",
  WARNING_ROYAL = "#C19E23",
  WARNING_LIGHT = "#E4D880",
  INFO_ROYAL = "#1D4A88",
  INFO_LIGHT = "#7FADE4",
  INFO_BLUE = "#3172D2",
  STEEL_ACTIVE = "#4F6786",
  PEACH_DARK = "#522E22",
}
