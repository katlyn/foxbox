declare module 'color-name-list' {
  export interface Color {
    name: string
    hex: string
  }

  const colors: Color[]

  export default colors
}
