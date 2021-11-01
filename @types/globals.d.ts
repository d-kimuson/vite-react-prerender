declare module "*.svg" {
  let path: string
  export default path
}

declare module "*.module.css" {
  let styles: Record<string, string>
  export default styles
}

declare module "*.module.scss" {
  let styles: Record<string, string>
  export default styles
}
