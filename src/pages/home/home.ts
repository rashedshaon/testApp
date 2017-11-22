import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  latitude:any;
  longitude:any;
  watchLatitude:any;
  watchLongitude:any;
  error:any;

  constructor(
    public navCtrl: NavController, 
    private geolocation: Geolocation
  ) {
    this.latitude = 0;
    this.longitude = 0;
    this.watchLatitude = 0;
    this.watchLongitude = 0;


    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
     }).catch((error) => {
       this.error = error;
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude
       this.watchLatitude = data.coords.latitude;
       this.watchLongitude = data.coords.longitude;
     });




  }

}
