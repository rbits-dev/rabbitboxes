import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit {
  @Input('appLazyLoad') src!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.loadImage();
  }

  loadImage() {
    const image = this.el.nativeElement;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.setAttribute(image, 'src', this.src);
          obs.unobserve(image);
        }
      });
    });

    observer.observe(image);
  }
}
