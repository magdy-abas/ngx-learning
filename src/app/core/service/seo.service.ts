import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  updateMeta(
    title: string,
    description: string,
    keywords: string,
    imageUrl: string
  ) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
