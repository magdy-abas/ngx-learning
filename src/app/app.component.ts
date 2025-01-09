import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SeoService } from './core/service/seo.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'e-learning';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMeta(
      'ELearning - Enhance Your Skills Online',
      'Explore our eLearning platform to enhance your skills with a wide variety of courses designed for learners at every level.',
      'eLearning, online learning, online courses, skill enhancement, education',
      'https://yourwebsite.com/og-image.jpg'
    );
  }
}
