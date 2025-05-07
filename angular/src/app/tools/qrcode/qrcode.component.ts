import { AfterViewInit, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms';
import { toDataURL } from 'qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardService } from '../../services/clipboard.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [
    MatInputModule, 
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements AfterViewInit {
  qrCodeData = "";
  imgData = ""

  constructor(
    private clipboardService: ClipboardService,
    private activeRoute: ActivatedRoute,
    private navigationService: NavigationService,
  ) { 
  }

  ngAfterViewInit(): void {
    let params = this.activeRoute.snapshot.queryParams
    if(params["content"]) {
      let content = params["content"]!
      this.qrCodeData = content
      this.update()
      console.log("from params:", this.qrCodeData)
    } else {
      this.qrCodeData = "https://www.google.com/";
      this.update()
      this.qrCodeData = ""
    }
  }

  update() {
    this.updateQRCode()
    this.updateUrlParams()
  }

  updateQRCode() {
    let img = document.getElementById('qrcode')
    toDataURL(this.qrCodeData).then(data => {
      this.imgData = data
      img!.setAttribute("src", data)
    })
  }

  updateUrlParams() {
    this.navigationService.updateUrlParams({
      content: this.qrCodeData.length > 0 ? this.qrCodeData : null
    })
  }

  copyImageToClipboard() {
    this.clipboardService.copyImage(this.imgData)
  }

  copyPageUrlToClipboard() {
    this.clipboardService.copyText(window.location.href)
  }
}
