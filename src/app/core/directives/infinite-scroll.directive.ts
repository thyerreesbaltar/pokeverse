import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy{
  @Output() scrolled = new EventEmitter<void>();

  private observer: IntersectionObserver | undefined;
  constructor(private element: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) { }
ngOnInit(): void {
    const options = {
      root: null, // null = viewport do navegador
      rootMargin: '0px',
      threshold: 0.5 // Dispara quando 50% do elemento estiver visível
    };
    
    if(isPlatformBrowser(this.platformId)){

      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.scrolled.emit(); // Avisa o componente!
        }
      }, options);

      this.observer.observe(this.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Boa prática: limpar o observer para evitar vazamento de memória
    this.observer?.disconnect();
  }
}
