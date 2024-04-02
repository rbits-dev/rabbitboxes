import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SwiperCore, { EffectCoverflow, EffectFade, Swiper, Autoplay } from 'swiper';
import { SwiperOptions } from 'swiper/types/swiper-options';
import 'swiper/scss';
import 'swiper/scss/autoplay';
import { nftSlider } from '../consts/nft-slider.const';
import { LandingSliderModel } from 'src/app/models/landing-slider.model';
import { LandingSliderProvider } from 'src/app/services/providers/landing-slider.provider';
import { environment } from 'src/environments/environment';
SwiperCore.use([EffectFade]);
SwiperCore.use([Autoplay]);
@Component({
  selector: 'app-landing-intro',
  templateUrl: './landing-intro.component.html',
  styleUrls: ['./landing-intro.component.scss']
})
export class LandingIntroComponent implements OnInit {

  slides: LandingSliderModel[] = [];
  assetBaseUrl = environment.assetBaseUrl
  config: SwiperOptions = {
    slidesPerView: 1,
    effect: 'fade',
    allowTouchMove: false,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      pauseOnMouseEnter: false,
    },
    speed: 3000,
    freeMode: {
      enabled: false,
      sticky: true,
    },
    grabCursor: false,
    loop: true,
    coverflowEffect: {
      depth: 500,
      slideShadows: false,
      rotate: -40,
      stretch: 100,
    },
  };

  constructor(private landingSliderProvider: LandingSliderProvider) {

  }

  ngOnInit(): void {
    this.slides = this.landingSliderProvider.getAllNftImages();
    this.landingSliderProvider.onChange().subscribe((list) => {
      this.slides = list;
    });
  }

  scrollToElement(page: string, fragment: string): void {
    const element = document.querySelector(`#${fragment}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
