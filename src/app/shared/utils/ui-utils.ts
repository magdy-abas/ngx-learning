import { ElementRef } from '@angular/core';

export function scrollToTop(topOfComponent?: ElementRef): void {
  if (topOfComponent) {
    topOfComponent.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
