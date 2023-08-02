import { CommonModule, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import {
  NgbCarousel,
  NgbCarouselModule,
  NgbSlideEvent,
  NgbSlideEventSource,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: true,
  imports: [NgbCarouselModule, NgIf],
  // imports:[NguCarouselModule,CommonModule],
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  //images = ['/assets/images/icons/img_1.png', '/assets/images/icons/img_2.png', '/assets/images/icons/img_3.png']
  images = [
    "/assets/images/icons/img_1.png",
    "/assets/images/icons/img_2.png",
    "/assets/images/icons/img_3.png",
  ]; // [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  // carouselConfig: NguCarouselConfig = {
  //   grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
  //   load: 3,
  //   interval: { timing: 1500, initialDelay: 1500 },
  //   loop: true,
  //   touch: true,
  //   velocity: 0.9,
  //   easing:'linear(1, -0.5, 0)'
  // };
  testimonialList: any = [
    {
      src: "/assets/images/icons/img_1.png",
      title: "Trade finance at your fingertips!",
    },
    {
      src: "/assets/images/icons/img_2.png",
      title: "One-Stop platform to meet your trade finance needs",
    },
    {
      src: "/assets/images/icons/img_3.png",
      title: "Making Trade Finance Globally Accessible! ",
    },
  ];

  constructor() {}
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  ngOnInit(): void {}
  @ViewChild("carousel", { static: true }) carousel: NgbCarousel;
  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT ||
        slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (
      this.pauseOnIndicator &&
      !slideEvent.paused &&
      slideEvent.source === NgbSlideEventSource.INDICATOR
    ) {
      this.togglePaused();
    }
  }
  paused = false;
  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }
}
