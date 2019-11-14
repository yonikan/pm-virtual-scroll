import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamPickerService } from '../core/services/team-picker.service';
import { AuthorizationService } from '../core/services/authorization.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.scss']
})
export class TeamOverviewComponent implements OnInit, OnDestroy {
  pageName = 'team overview';
  private currentTeamUpdateSub: Subscription;
  isLoading = true;
  isLoadRiskFeatureEnabled = false;

  config: SwiperConfigInterface = {
    // a11y: true,
    direction: 'horizontal',
    // slidesPerView: 1.2,
    keyboard: true,
    grabCursor: true,
    // mousewheel: true,
    scrollbar: false,
    // centeredSlides: true,
    // loop: true,
    // slidesPerView: 'auto',
    spaceBetween: 30,
    // navigation: false,
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
    pagination: true,
    // pagination: {
    //   el: '.swiper-pagination',
    //   // clickable: true,
    //   // type: 'bullets',
    //   // dynamicBullets: true,
    //   // dynamicMainBullets: 2
    // },
    slidesPerView: 4.2,
    breakpoints: {
      // 380: {
      //   slidesPerView: 1,
      //   spaceBetween: 20
      // },
      // 640: {
      //   slidesPerView: 2,
      //   spaceBetween: 30
      // },
      768: {
        slidesPerView: 1.2,
        spaceBetween: 30
      }
    }
  };
  index = 1;

  constructor(public teamPickerService: TeamPickerService, private authorizationService: AuthorizationService) {}

  ngOnInit() {
    this.isLoadRiskFeatureEnabled = this.authorizationService.isFeatureEnabled('loadRisk');
    this.isLoading = true;

    this.currentTeamUpdateSub = this.teamPickerService
      .getCurrentTeamUpdateListener()
      .subscribe(currentTeam => {
        // console.log('TEAM OVERVIEW - currentTeam: ', currentTeam);
        this.isLoading = false;
      });
  }

  ngOnDestroy(){
    this.currentTeamUpdateSub.unsubscribe();
  }
}
