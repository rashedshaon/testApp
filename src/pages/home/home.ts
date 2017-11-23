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
  dataError:any;
  items:any = [];
  distance:any = -10048;
  speed:any = 0;

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
       this.dataError = error;
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude
       //this.watchLatitude = data.coords.latitude;
       //this.watchLongitude = data.coords.longitude;
        if(this.watchLatitude != data.coords.latitude && this.watchLongitude != data.coords.longitude){
          
          this.watchLatitude = data.coords.latitude;
          this.watchLongitude = data.coords.longitude;
          //this.speed = data.coords.speed;
          
          if(this.latitude != this.watchLatitude && this.longitude != this.watchLongitude)
          {
            let thisDistance = this.getDistanceFromLatLonInKm(
                                          this.latitude,
                                          this.longitude, 
                                          this.watchLatitude, 
                                          this.watchLongitude
                                        );
            this.distance = this.distance + thisDistance;
            this.latitude = this.watchLatitude;
            this.longitude = this.watchLongitude;
            this.items.push({lat: this.watchLatitude, long:this.watchLongitude, distance: thisDistance});
          }
        }
     });
  }

  getDistanceFromLatLonInKm(lat1,lon1, lat2,lon2)
  {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1); 
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *  Math.sin(dLon/2) * Math.sin(dLon/2); 

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
  }

  getDistanceFromLatLonInKm2(lat1,lon1, lat2,lon2)
  {
    let R = 6371e3; // metres
    let φ1 = lat1.toRadians();
    let φ2 = lat2.toRadians();
    let ln:any = lon2-lon1;
    let lt:any = lat2-lat1;

    let Δλ = ln.toRadians();
    let Δφ = lt.toRadians();
    
    let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    let d = R * c;
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}
