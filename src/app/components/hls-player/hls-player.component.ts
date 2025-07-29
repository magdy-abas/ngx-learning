import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import Hls from 'hls.js';
import Plyr from 'plyr';
import { NgIf } from '@angular/common';
import { GlobalTranslateService } from '../../core/service/global-translate.service';

@Component({
  selector: 'app-hls-player',
  standalone: true,
  templateUrl: './hls-player.component.html',
  styleUrls: ['./hls-player.component.scss'],
  imports: [NgIf],
})
export class HlsPlayerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;
  @Input() src: string = '';
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;
  @Input() muted: boolean = false;
  @Input() preload: 'none' | 'metadata' | 'auto' = 'metadata';

  @Output() playerReady = new EventEmitter<void>();
  @Output() error = new EventEmitter<any>();

  private hls: Hls | null = null;
  private player: Plyr | null = null;
  public showInitialLoader: boolean = true;
  constructor(private translate: GlobalTranslateService) {}

  ngAfterViewInit(): void {
    if (this.src) {
      this.initializePlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].firstChange) {
      this.destroyPlayer();
      if (this.src) {
        this.initializePlayer();
      }
    }
  }

  private initializePlayer(): void {
    const video = this.videoElement.nativeElement;
    video.poster = this.poster;
    video.muted = this.muted;
    video.preload = this.preload;

    if (Hls.isSupported()) {
      this.initializeHls();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.initializeSafariHls();
    } else {
      this.handleError('HLS not supported in this browser');
    }
  }

  private initializeHls(): void {
    const video = this.videoElement.nativeElement;

    this.hls = new Hls();
    this.hls.loadSource(this.src);
    this.hls.attachMedia(video);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const availableQualities = (this.hls?.levels || [])
        .map((level) => level.height)
        .sort((a, b) => b - a);

      const defaultQuality = availableQualities ? availableQualities[0] : 720;

      this.initializePlyr(availableQualities, defaultQuality);
    });

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      this.handleHlsError(data);
    });
  }

  private initializePlyr(
    availableQualities: number[],
    defaultQuality: number
  ): void {
    const lang = this.translate.language$.value;
    const video = this.videoElement.nativeElement;
    if (this.player) {
      this.player.destroy();
    }

    this.player = new Plyr(video, {
      i18n: lang === 'ar' ? this.getArabicI18n() : {},
      controls: [
        'play-large',
        'rewind',
        'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'fullscreen',
      ],
      settings: ['quality', 'speed', 'captions'],
      tooltips: {
        controls: true,
        seek: true,
      },
      quality: {
        default: defaultQuality,
        options: availableQualities,
        forced: true,
        onChange: (newQuality: number) => {
          const levelIndex = this.hls?.levels.findIndex(
            (level) => level.height === newQuality
          );
          if (levelIndex !== -1 && levelIndex != null) {
            this.hls!.currentLevel = levelIndex;
          }
        },
      },
    });

    this.player.once('ready', () => {
      this.showInitialLoader = false;
      video.style.visibility = 'visible';
      this.playerReady.emit();
    });
  }

  private initializeSafariHls(): void {
    const video = this.videoElement.nativeElement;
    video.src = this.src;

    video.addEventListener('loadedmetadata', () => {
      this.initializePlyr([], 720);
    });

    video.addEventListener('error', (e) => {
      this.handleError('Safari HLS error', e);
    });
  }

  private handleHlsError(data: any): void {
    console.error('HLS Error:', data);
  }

  private handleError(message: string, details?: any): void {
    console.error(message, details);
    this.error.emit({ message, details });
  }

  private destroyPlayer(): void {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }

  private getArabicI18n() {
    return {
      restart: 'إعادة التشغيل',
      rewind: 'رجوع 10 ثواني',
      play: 'تشغيل',
      pause: 'إيقاف مؤقت',
      fastForward: 'تقديم 10 ثواني',
      seek: 'تخطي',
      seekLabel: '{seektime} ثانية',
      played: 'تم التشغيل',
      buffered: 'تم التحميل المؤقت',
      currentTime: 'الوقت الحالي',
      duration: 'المدة',
      volume: 'الصوت',
      mute: 'كتم الصوت',
      unmute: 'إلغاء الكتم',
      enableCaptions: 'تشغيل الترجمة',
      disableCaptions: 'إيقاف الترجمة',
      download: 'تحميل',
      enterFullscreen: 'ملء الشاشة',
      exitFullscreen: 'الخروج من ملء الشاشة',
      frameTitle: 'مشغل للفيديو',
      captions: 'الترجمة',
      settings: 'الإعدادات',
      menuBack: 'رجوع',
      speed: 'السرعة',
      normal: 'عادي',
      quality: 'الجودة',
      loop: 'تشغيل متكرر',
    };
  }

  ngOnDestroy(): void {
    this.destroyPlayer();
  }
}
