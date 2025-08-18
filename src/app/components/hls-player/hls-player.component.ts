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

  private _onLoadedData?: () => void;
  private _onCanPlay?: () => void;

  constructor(private translate: GlobalTranslateService) {}

  ngAfterViewInit(): void {
    if (this.src) {
      this.initializePlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].firstChange) {
      this.destroyPlayer();
      this.showInitialLoader = true;
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

    video.style.visibility = 'hidden';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';

    this._onLoadedData = () => this.finishLoading();
    this._onCanPlay = () => this.finishLoading();

    video.addEventListener('loadeddata', this._onLoadedData, { once: true });
    video.addEventListener('canplay', this._onCanPlay, { once: true });

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

      const defaultQuality = availableQualities?.[0] || 720;

      this.initializePlyr(availableQualities, defaultQuality);
    });

    this.hls.on(Hls.Events.ERROR, (_event, data) => {
      if (!data.fatal) return;
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          this.hls?.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this.hls?.recoverMediaError();
          break;
        default:
          this.handleHlsError(data);
      }
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
          if (levelIndex != null && levelIndex >= 0) {
            this.hls!.currentLevel = levelIndex;
          }
        },
      },
    });

    this.player.once('ready', () => {
      if (video.readyState >= 2) {
        this.finishLoading();
      }
      this.playerReady.emit();

      if (this.autoplay) {
        video.muted = this.muted || true;
        video.play().catch(() => {});
      }
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

  private finishLoading(): void {
    if (!this.showInitialLoader) return;
    const video = this.videoElement.nativeElement;

    this.showInitialLoader = false;

    video.style.visibility = 'visible';
    video.style.opacity = '1';
    video.style.pointerEvents = 'auto';
  }

  private handleHlsError(data: any): void {
    console.error('HLS Error:', data);
    this.destroyPlayer();
    this.error.emit(data);
  }

  private handleError(message: string, details?: any): void {
    console.error(message, details);
    this.error.emit({ message, details });
  }

  private destroyPlayer(): void {
    const video = this.videoElement?.nativeElement;
    if (video) {
      if (this._onLoadedData) {
        video.removeEventListener('loadeddata', this._onLoadedData);
        this._onLoadedData = undefined;
      }
      if (this._onCanPlay) {
        video.removeEventListener('canplay', this._onCanPlay);
        this._onCanPlay = undefined;
      }
    }
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
