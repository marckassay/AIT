import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Input, Output, EventEmitter } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';

/**
 * Generated class for the NumericDisplayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-numeric-display',
  templateUrl: 'numeric-display.html'
})
export class NumericDisplayPage implements OnInit {

  counter0 = 50;
	timer0Id: string;

  isActive = true;
  colorVar = '#ffd800'

  constructor(public navCtrl: NavController, public navParams: NavParams, private st: SimpleTimer) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NumericDisplayPage');
  }

	ngOnInit() {
    this.st.newTimer('1sec',1);
    this.subscribeTimer0();
  }
  delAllTimer() {
    this.st.delTimer('1sec');
  }

	subscribeTimer0() {
		if (this.timer0Id) {
			// Unsubscribe if timer Id is defined
			this.st.unsubscribe(this.timer0Id);
			this.timer0Id = undefined;
			console.log('timer 0 Unsubscribed.');
		} else {
			// Subscribe if timer Id is undefined
			this.timer0Id = this.st.subscribe('1sec', () => {
        this.counter0--
        if(this.counter0 < 40) {

        }
        console.log(this.counter0);
      });
			console.log('timer 0 Subscribed.');
		}
		console.log(this.st.getSubscription());
  }

  get counter() {
    return this.counter0;
  }
}
