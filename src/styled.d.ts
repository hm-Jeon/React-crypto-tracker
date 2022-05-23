import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
    coinsCardBgColor: string;
    coinTextColor: string;
    coinBoxBgColor: string;
  }
}
