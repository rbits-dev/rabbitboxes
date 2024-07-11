import { Component, OnInit } from '@angular/core';
import SwiperCore, { EffectCoverflow, Swiper, Autoplay } from 'swiper';
import { SwiperOptions } from 'swiper/types/swiper-options';
import 'swiper/scss';

import { nftSlider } from '../consts/nft-slider.const';
import { LandingSliderModel } from 'src/app/models/landing-slider.model';
import { LandingSliderProvider } from 'src/app/services/providers/landing-slider.provider';
import { environment } from 'src/environments/environment';
SwiperCore.use([EffectCoverflow]);
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-landing-nfts',
  templateUrl: './landing-nfts.component.html',
  styleUrls: ['./landing-nfts.component.scss']
})
export class LandingNftsComponent implements OnInit {


  slides: LandingSliderModel[] = [];

  initialSlideStartIndex = Math.floor((this.slides.length - 1) / 2);
  sliderIndex = this.initialSlideStartIndex;
  currentSliderName = this.slides[this.sliderIndex]?.name ?? '';

  config: SwiperOptions = {
    slidesPerView: 3,
    effect: 'coverflow',
    direction: 'horizontal',
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    speed: 1000,
    centerInsufficientSlides: true,
    freeMode: {
      enabled: false,
      sticky: true,
    },
    grabCursor: true,
    initialSlide: 3,
    loop: true,
    coverflowEffect: {
      depth: 400,
      slideShadows: false,
      rotate: 0,
      stretch: 0,
    },
    breakpoints: {
      801: {
        slidesPerView: 3
      },
      400: {
        slidesPerView: 1.7
      },
      100: {
        slidesPerView: 1.3
      }
    }

  };

  constructor(public landingSliderProvider: LandingSliderProvider) {
  }

  ngOnInit(): void {
    this.slides = this.landingSliderProvider.getAllNftImages();
    this.landingSliderProvider.onChange().subscribe((list) => {
      this.slides = list;
    });
  }

  onIndexChange(event: any): void {
    this.currentSliderName = this.slides[event.realIndex]?.name ?? '';
  }

  scrollToElement(page: string, fragment: string): void {
    const element = document.querySelector(`#${fragment}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
   //handle Image Error
 handleImageError(event: Event): void {
  const element = event.target as HTMLImageElement;
  element.src = `${environment.assetBaseUrl}/media/images/nftnotfound.jpg`;
}
}
