// see https://www.i18next.com/overview/typescript
import "i18next";

// This configuration is necessary, because the t() Function can now return null.
// See: https://www.i18next.com/overview/typescript#argument-of-type-defaulttfuncreturn-is-not-assignable-to-parameter-of-type-xyz
declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

declare module "*.svg" {
  const content: string;
  export default content;
}
