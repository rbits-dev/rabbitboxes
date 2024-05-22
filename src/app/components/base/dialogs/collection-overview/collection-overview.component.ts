import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss']
})
export class CollectionOverviewComponent implements OnInit {
  slides: any[] = [];
  artistData: any;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    effect: 'fade',
    allowTouchMove: false,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      pauseOnMouseEnter: true,
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

  swiperConfigMobile: SwiperOptions = {
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
      700: {
        slidesPerView: 3,
      },
      600: {
        slidesPerView: 3,
      },
      500: {
        slidesPerView: 2.4,
      },
      300: {
        slidesPerView: 1.5,
      },
      200: {
        slidesPerView: 1.5,
      }

    }

  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.slides = data.slides;
    this.artistData = data.artistData;
  }

  ngOnInit(): void {
  }

  getMinPrice(item: any) {
    const { Diamond, Wood, Silver, Gold } = item;
    if (Diamond == Wood && Diamond == Silver && Diamond && Gold)
      return item['minPrice'];

    return `from ${item['minPrice']}`;
  }

  getPreviewImageUrl(url: string): string {
    const splitUrl = url.split('/');
    const filename = splitUrl.pop();
    const collectionName = splitUrl.pop();
    const partsBeforeFilename = splitUrl.join('/');

    if (filename && filename.includes('.')) {
        const ext = filename.split('.').pop() || '';
        const filenameWithoutExt = filename.slice(0, -ext.length - 1);
        const previewImage = `${partsBeforeFilename}/previews/${collectionName}/${filenameWithoutExt}.webp`;
        return previewImage;
    }
    return `${partsBeforeFilename}/previews/${collectionName}/${filename}`;
  }

  checkFileType(url: string) {
    const images = ["jpg", "gif", "png", "jpeg", "JPG", "GIF", "PNG", "JPEG"];
    const videos = ["mp4", "3gp", "ogg", "MP4", "3GP", "OGG"];

    const urltemp = new URL(url);
    const extension = urltemp.pathname.substring(
      urltemp.pathname.lastIndexOf(".") + 1
    );

    if (images.includes(extension)) {
      return true;
    } else if (videos.includes(extension)) {
      return false;
    }
    return true;
  }

   //handle Image Error
 handleImageError(event: Event): void {
  const element = event.target as HTMLImageElement;
  element.src = `${environment.assetBaseUrl}/media/images/nftnotfound.jpg`;
}

}
