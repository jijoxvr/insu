import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Injectable()
export class AppConfigService {

  insuranceStatus = {
    'PAYMENT_PENDING': 'PAY_PEND',
    'ACTIVATION_PENDING': 'ACT_PEND',
    'ACTIVATION_PROGRESS': 'ACT_PROG',
    'ACTIVATED': 'ACTV',
    'CLAIMED': 'CLM'
  }
  claimReason = {
    'DAMAGE': 'DMG',
    'LOST': 'LST',
    'ACCIDENTAL_DAMAGE': 'ACDMG',
    'LIQUID_DAMAGE': 'LQDMG',
    'THEFT': 'TFT',
    'BURGLARY': 'BRG',
    'ROBBERY': 'ROB',
  }

  constructor() { }

  testUserInfo(): Observable<any> {
    return Observable.create(observer => {
      console.log('testing')
      observer.complete();
    })
  }
}
