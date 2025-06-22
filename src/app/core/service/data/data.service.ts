import { Injectable } from '@angular/core';

export type Lang = 'en' | 'ar';

export interface WelcomeSlide {
  img: string;
  content1: Record<Lang, string>;
  content2: Record<Lang, string>;
  paragraph: Record<Lang, string>;
}

export interface WelcomeSlideView {
  img: string;
  content1: string;
  content2: string;
  paragraph: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private slides: WelcomeSlide[] = [
    {
      img: 'assets/img/login-img.png',
      content1: { en: 'Welcome to', ar: 'مرحباً بك في' },
      content2: {
        en: '{{appName}} - Your Online Learning Platform.',
        ar: '{{appName}} - منصتك للتعلم عبر الإنترنت',
      },
      paragraph: {
        en: 'Join thousands of learners advancing their careers.',
        ar: 'انضم إلى الآلاف من المتعلمين الذين يطورون مسيرتهم المهنية.',
      },
    },
    {
      img: 'assets/img/login-img.png',
      content1: { en: 'Start Learning', ar: 'ابدأ التعلم' },
      content2: { en: 'From Top Instructors.', ar: 'مع أفضل المحاضرين' },
      paragraph: {
        en: 'Gain practical skills and certificates for your future.',
        ar: 'احصل على مهارات عملية وشهادات تفتح لك الأبواب.',
      },
    },
    {
      img: 'assets/img/login-img.png',
      content1: { en: 'Empower Your Future', ar: 'طور مستقبلك' },
      content2: { en: 'With Quality Education.', ar: 'بتعليم عالي الجودة' },
      paragraph: {
        en: 'Wide range of topics to keep you competitive.',
        ar: 'مجموعة واسعة من المواضيع لتظل متقدماً.',
      },
    },
  ];

  public getWelcomeSlides(appName: string, lang: Lang) {
    return this.slides.map((slide) => ({
      img: slide.img,
      content1: slide.content1[lang],
      content2: slide.content2[lang].replace('{{appName}}', appName),
      paragraph: slide.paragraph[lang],
    }));
  }
}
