import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LandingSliderModel } from "src/app/models/landing-slider.model";
import { HttpApiService } from "../http-api.service";

@Injectable({ providedIn: "root" })
export class LandingSliderProvider {
  private liveCollectionList: any[] = [];
  private allNftImages: LandingSliderModel[] = [];
  isLoading = true;
  private subjectLandingSlider = new Subject<LandingSliderModel[]>();

  constructor(private httpService: HttpApiService) {
    this.getLiveCollectionsAddresses();
  }

  onSave(data: LandingSliderModel[]): void {
    this.subjectLandingSlider.next(this.shuffleList(data));
  }

  onChange(): Observable<LandingSliderModel[]> {
    return this.subjectLandingSlider.asObservable();
  }

  getAllNftImages = (): LandingSliderModel[] => this.allNftImages;

  async getLiveCollectionsAddresses(): Promise<any> {
    try {
      const response = await this.httpService.getLiveCollectionsBanner();

      if (response.data && response.data.live_data_array) {
        this.liveCollectionList = response.data.live_data_array;
      } else {
        this.liveCollectionList = [];
      }

      if (response.data && response.data.recent_data_array) {
        this.liveCollectionList = this.liveCollectionList.concat(
          response.data.recent_data_array
        );
      }

      for (let i = 0; i < this.liveCollectionList.length; i++) {
        await this.httpService
          .getRandomCollectionImageListFromArtist(
            this.liveCollectionList[i].walletAddress
          )
          .then((res) => {
            for (let j = 0; j < 5; j++) {
              if (res.data[j] !== undefined)
                if (
                  !res.data[j].logo_path.includes(".mp4") &&
                  !res.data[j].logo_path.includes(".gif")
                )
                  this.allNftImages.push(
                    new LandingSliderModel(
                      this.getPreviewImageUrl(res.data[j].logo_path),
                      res.artistData.collectionName,
                      i < response.data.live_data_array.length
                        ? "artist/" + this.liveCollectionList[i].walletAddress
                        : "recent"
                    )
                  );
            }
          });
      }

      this.isLoading = false;
      this.onSave(this.allNftImages);
      return this.allNftImages;
    } catch (error) {
      this.isLoading = false;
    }
  }

  getPreviewImageUrl(url: string): string {
    const splitUrl = url.split("/");
    const filename = splitUrl.pop();
    const collectionName = splitUrl.pop();
    const partsBeforeFilename = splitUrl.join("/");

    if (filename && filename.includes(".")) {
      const ext = filename.split(".").pop() || "";
      const filenameWithoutExt = filename.slice(0, -ext.length - 1);
      const previewImage = `${partsBeforeFilename}/previews/${collectionName}/${filenameWithoutExt}.webp`;
      //console.log(previewImage);
      return previewImage;
    }
    return `${partsBeforeFilename}/previews/${collectionName}/${filename}`;
  }

  shuffleList(list: any[]): any[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    return list;
  }
}
