import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { fadeInOutAnimation } from '../../core/animations/fade-in-out.animation';
import { TEAM_EVENTS_VALIDATED_DATA } from 'server/data/team-events-validated.data';
import { EventsCarouselModalComponent } from '../events-carousel/events-carousel-modal/events-carousel-modal.component';
import { MatDialog } from '@angular/material';
import { UiComponentsService } from '../../core/services/ui-components.service';
import { enumToString } from '../../core/helpers/helper-functions';
import { teamEvents } from '../../core/enums/team-events.enum';
import { Router } from '@angular/router';
import { ValidatedEventsService } from './validated-events.service';
import { ServerEnvService } from '../../core/services/server-env.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-validated-events',
  templateUrl: './validated-events.component.html',
  styleUrls: ['./validated-events.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ValidatedEventsComponent implements OnInit {
  teamEvents;
  isTeamEventsLoading;
  index = 0;

  isLoading = true;
  testObs: Observable<any>;
  list; 

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private serverEnvService: ServerEnvService,
    private uiComponentsService: UiComponentsService,
    private validatedEventsService: ValidatedEventsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.list = '1'.repeat(100000).split('').map((_, i) => i); 

    // of(TEAM_EVENTS_VALIDATED_DATA)

    const TEAM_ID = this.authService.getUserLoginData().teams[0].id;
    console.log('TEAM_ID: ', TEAM_ID);
    const BASE_URL = this.serverEnvService.getBaseUrl();
    const API_VERSION = 'v2';
    this.http
      .get<any>(`${BASE_URL}/${API_VERSION}/team/${TEAM_ID}/team-events`)
      .subscribe((result: any) => {
        // console.log('result: ', result);
        this.teamEvents = result; // only validated team-events
        this.isLoading = false;
        // this.testObservable(result); // test
        this.isTeamEventsLoading = false;
      }, (err) => {
        console.log('err: ', err);
      });
  }

  // testObservable(teamEvents): Observable<any> {
  //   // let payload = {

  //   // }
  //   // return this.testObs;
  // }

  onEditSession(teamEvent) {
    console.log('teamEvent: ', teamEvent);
    // const teamEventString = enumToString(teamEvents, teamEvent.teamEventType).toLowerCase().trim();
    // this.uiComponentsService.setIsLoading(true);
    // setTimeout(() => { 
    //   this.uiComponentsService.setIsLoading(false);
    //   this.router.navigate([`/team-event-validation/${teamEventString}/${teamEvent.teamEventId}`]);
    //  }, 1000);
  }

  onDeleteSession(teamEventId) {
    console.log('teamEventId: ', teamEventId);

    const modalTitle = 'Delete Session';
    const modalMessage = `Are you sure you want to delete the session?`;
    const dialogRef = this.dialog.open(EventsCarouselModalComponent, {
      width: '500px',
      height: '200px',
      data: { 
        title: modalTitle,
        message: modalMessage,
        modalData: teamEventId
      }
    });

    dialogRef.afterClosed()
      .subscribe(modalData => {
        if(modalData) {
          // this.uiComponentsService.setIsLoading(true);
          // setTimeout(() => { 
          //   this.uiComponentsService.setIsLoading(false);
          //     const teamIndex = this.teamEvents.findIndex((teamEvent) => teamEvent.id === teamEventId );
          //     this.teamEvents.splice(teamIndex, 1);
          //  }, 2000);

          this.uiComponentsService.setIsLoading(true);
          this.http
            .delete<any>(`https://football-dev.playermaker.co.uk/api/v1/team_event/${teamEventId}`)
            .subscribe((result: any) => {
              this.uiComponentsService.setIsLoading(false);
              const teamIndex = this.teamEvents.findIndex((teamEvent) => teamEvent.id === teamEventId );
              this.teamEvents.splice(teamIndex, 1);
            }, (err) => {
              console.log('err: ', err);
            });
        }
      });
  }

  onDownloadPdfReport(report) {
    console.log('report: ', report);
  }
}
