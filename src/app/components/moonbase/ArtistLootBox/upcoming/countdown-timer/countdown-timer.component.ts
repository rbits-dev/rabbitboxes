import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  formatDate
} from '@angular/common';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
  @Input() date: string;
  interval: any;
  timer: any = 0;
  checkdate = "";
  constructor() { }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    // Set the date we're counting down to
    var date = new Date(this.date + " UTC");
    var countDownDate = new Date(formatDate(date.toString(), "yyyy/MM/dd HH:mm:ss", "en-us")).getTime();
    // Update the count down every 1 second
    this.interval = setInterval(function () {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // Display the result in the element with id="demo"
      if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
        this.timer = (days <= 9 ? `0${days}` : days) + " D : " +
          (hours <= 9 ? `0${hours}` : hours) + " H : " +
          (minutes <= 9 ? `0${minutes}` : minutes) + " M : " +
          (seconds <= 9 ? `0${seconds}` : seconds) + " S";
      } else {
        this.timer = 0;
      }

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(this.interval);
      }
    }.bind(this), 1000);
  }

}