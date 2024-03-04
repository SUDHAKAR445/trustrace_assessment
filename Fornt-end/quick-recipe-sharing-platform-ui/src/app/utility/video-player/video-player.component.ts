import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  standalone: true,
})
export class VideoPlayerComponent {
  @Input() videoUrl: string = '';

  constructor(private sanitizer: DomSanitizer) { }

  get safeVideoUrl(): SafeResourceUrl {
    const videoId = this.extractVideoId();
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl);
  }

  private extractVideoId(): string {
    const videoIdMatch = this.videoUrl.match(/[?&]v=([^&#]+)/i);
    return videoIdMatch ? videoIdMatch[1] : '';
  }
}