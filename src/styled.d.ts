// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    stepColor: string;

    msgColor_back: string;
    msgColor_back_title: string;
    msgColor_content_ment: string;
    msgColor_content_memo: string;
    msgColor_content_syst: string;
    msgColor_content_work: string;
    msgColor_content_font: string;
    msgEle_border_radius: string;
  }
}
