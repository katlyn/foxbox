declare module 'nearest-color' {
  export interface ColorMap {
    [key: string]: string
  }

  export interface ColorMatch {
    name: string
    value: string
    rgb: { r: number, b: number, g: number }
    distance: number
  }

  function ColorMatcher (color: string): ColorMatch

  export default {
    from: (colors: ColorMap) => ColorMatcher
  }
}
