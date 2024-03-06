import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  swiperConfig: any = {
    // Swiper configurations
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
  };

}
