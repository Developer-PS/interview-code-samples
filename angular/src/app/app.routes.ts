import { Routes } from '@angular/router';
import { GenericChecklistComponent } from './tools/generic-checklist/generic-checklist.component';
import {
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NosleepComponent } from './tools/nosleep/nosleep.component';
import { QrcodeComponent } from './tools/qrcode/qrcode.component';
import { DataEncoderComponent } from './tools/data-encoder/data-encoder.component';
import { SearchComponent } from './main/search/search.component';
import { ClockComponent } from './tools/clock/clock.component';
import { TimerComponent } from './tools/timer/timer.component';
import { Tags, postProcessRoutes } from './util/routing';
import { HomepageComponent } from './main/homepage/homepage.component';
import { ImpressumComponent } from './main/impressum/impressum.component';
import { PrivacyPolicyComponent } from './main/privacy-policy/privacy-policy.component';
import { CSMatchmakerComponent } from './tools/csmatchmaker/csmatchmaker.component';
import { CrosshairstoreMainComponent } from './tools/crosshairstore/main/main.component';
import { PasswordgeneratorComponent } from './tools/passwordgenerator/passwordgenerator.component';
import { WavegeneratorComponent } from './tools/wavegenerator/wavegenerator.component';
import { CakecalculatorComponent } from './tools/cakecalculator/cakecalculator.component';
import { ColorpickerComponent } from './tools/colorpicker/colorpicker.component';
//import { VentilationComponent } from './tools/ventilation/ventilation.component';

const raw_routes = [
  {
    path: '',
    component: HomepageComponent,
    title: 'Home',
    data: {
      hidden: 'true',
    },
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
    title: 'Impressum',
    data: {
      hidden: 'true',
    },
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy',
    data: {
      hidden: 'true',
    },
  },
  {
    path: 'search',
    component: SearchComponent,
    title: 'Search',
    data: {
      hidden: 'true',
    },
  },
  {
    path: 'csmatchmaker/:username/:password',
    component: CSMatchmakerComponent,
    title: 'CSMatchmaking',
    data: {
      tags: [Tags.CounterStrike],
      hidden: 'true',
    },
  },
  {
    path: 'checklist/:content',
    component: GenericChecklistComponent,
    title: 'Checklist',
    data: {
      hidden: 'true',
    },
  },
  {
    path: 'passwordgenerator',
    component: PasswordgeneratorComponent,
    title: 'Password Generator',
    data: {
      hidden: 'true',
    },
  },
  {
    path: 'golden-stopwatch-checklist',
    component: GenericChecklistComponent,
    title: 'Golden Stopwatch Checklist',
    data: {
      tags: [Tags.IdleOn],
      content: "H4sIAAAAAAAACn1TTW_aQBC951eMfGqltlI_D70BSSlqrNBAm0OVw2APZuT96u46FEX8984aEoxBuWB2387se_PePl4AZJGjouwrZJNSkTUwtqokA7No3RpjsYLRiopacYjZm3S+sCaSiVLxKEvZuIkr8rL80y5hv91CORte2BAgOFyb0DnUwpf+HVzSkgpsQtv8gLBCxyVGKmGmmrA6hvMmtlAuiLdW94qtJgs5VvqkLWmhnno69qLb+jJ7xu_3_7ZPJdm4YVXCHEN96JPlJJX9zdnKOvAUoi3qw+4wSf9BGxgpZN05PrJKIGo0zLmoKZ4cuEVTWg1XD2nSh6tlnBVqgkGMpF3sEiAMYl6vYNygRxEsikd+EyIqyO1C1LduHI6RhlbB7V5BC9zv8OzOepnC+455mYyvJph7dPDM6dVkCQ0o+0AgKyWi5FPZ191xWNe5dcqF4SIFbY1r3MAlstrAz0Y4KDbUoScuJM8ianeO2ocutSn6yIUiGDaLhXx+ucpjSYd7O_G85r8NlzvpIxti0k+xn9IbQ5DLeIWcDOo4UANwyB7sMkG9sA3RV8hGolK9FLKBKlakN_CbxZ1TY6eJ181yyQWdkzAJSqICV_8clRzZnj6yoY3ywHvcxLr+m+oEJLzE946ollG02R5i6n3Ok4+JxvHWp65NO7MlRwXtwg_XrDmea_X5KHlGCuVts+pkX1ZsKhihi2ngyc9zjb4cNyKsU9XEiGyTvH9gye4uAs+9W_Tt2Nv16fOeNVpbk3rs5gDfScIXzh34hlo4on+K456e_G4vtv8BZI2snocFAAA="
    }
  },
  {
    path: 'picnic-quest-items',
    component: GenericChecklistComponent,
    title: 'Picnic Daily Quest Items',
    data: {
      tags: [Tags.IdleOn],
      content: "H4sIAAAAAAAACo2QPW_CMBCGd37Fq8wdCBILI1RtUUlLlW5Vh8NczSnGrpKLCEL89xqzhLB0sXR+3o_TnUZApqKOsxmytRgvBqWGAx3oiEcSd8RHy41iqbxvsoeL3gSv7DU6TnHEf3wzfCVpFGMyHnd4qoPFiu018gryC5gzeZRODN+hdUSt9r7zaXI4JrPDKtyEYRrRc01NE2vop0dS_6Jut4x3ccOSZR085lT3o5B3KE3rflW8xWcIrhniZHtht2ftobTfK29oE48jprqzFWTj4QomdeFmSWDS4a21rFhQxUNSyNaL3UUYQiWcJfod3_Po_AcYOO8a1AEAAA=="
    }
  },
  {
    path: 'swimming',
    component: GenericChecklistComponent,
    title: 'Swimming Checklist',
    data: {
      hidden: "true",
      content: "H4sIAAAAAAAACm2QsQ6CQAyGd57icrOLqyORxMUJEwfjgEflLpRCuBKjhMVncfQR2HgTn8QTDSRgp+b70vZPa0+4kmwYQa6EDC8mywwlcvEVKicGYqfqHvQwsNYxE6HDhwH3ahNRzJXSv_mB+1EMOrcw5aHSn4un0iDO5M6oFFgO8Dh66edU2fn95ev+FNuupRuIc9eWIiwMxdPFAULKZY5XToDL7kHpv7xWaYyKAmgq15VTCeCU70FpC5gimLhyPxyD913jNW_jdadibwEAAA=="
    }
  },
  //{
  //  path: 'ventilation',
  //  component: VentilationComponent,
  //  title: 'Lüftungsassistent',
  //  data: {
  //    hidden: "true",
  //    tags: [Tags.Tool],
  //    description: "Berechnet, ob es sich basierend auf der Luftfeuchtigkeit zu lüften lohnt"
  //  }
  //},
  {
    path: 'data-encoder',
    component: DataEncoderComponent,
    title: 'Data Encoder',
    data: {
      tags: [Tags.Tool],
    }
  },
  {
    path: 'nosleep',
    component: NosleepComponent,
    title: 'WakeLock',
    data: {
      tags: [Tags.Tool],
      description: ""
    }
  },
  {
    path: 'qrcode',
    component: QrcodeComponent,
    title: 'QR Code Generator',
    data: {
      tags: [Tags.Tool],
      description: "Generate QR Codes From URLs"
    }
  },
  {
    path: 'clock',
    component: ClockComponent,
    title: 'Clock',
    data: {
      tags: [Tags.Tool],
    },
  },
  {
    path: 'timer',
    component: TimerComponent,
    title: 'Timer',
    data: {
      tags: [Tags.Tool],
    },
  },
  {
    path: 'soundgenerator',
    component: WavegeneratorComponent,
    title: 'Sound Generator',
    data: {
      tags: [Tags.Tool],
    },
  },
  {
    path: 'cake',
    component: CakecalculatorComponent,
    title: 'Cake Tin Converter',
    data: {
      tags: [Tags.Tool],
      description: "Calculate the conversion factor between two cake tins"
    },
  },
  {
    path: 'colorpicker',
    component: ColorpickerComponent,
    title: 'Color Picker',
    data: {
      tags: [Tags.Tool],
      description: "Find the color of any pixel on your screen!"
    },
  },
  {
    path: 'crosshairstore',
    component: CrosshairstoreMainComponent,
    title: 'Crosshair Store',
    data: {
      tags: [Tags.Tool],
      hidden: true
    },
  },
];

export const routes: Routes = postProcessRoutes(raw_routes);

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Mega Prism - ${title}`);
    }
  }
}
