import { DataService } from '../services/data.service';
import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
//import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  listData: any = [];

  //for modal 
  selectedImage: any = [];
  selectedDate: any = [];
  selectedDescription: any = [];
  selectedAmount: any = [];
  selectedImageDate: any = [];

  @ViewChild(IonModal)
  modal!: IonModal;

  //@ViewChild(IonContent)
  //content!: IonContent;

  constructor(private dataService: DataService) {
    this.loadData();
  }

  //scrollToBottom() {
    //this.content.scrollToBottom(1000);
  //}

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    console.log('dismiss')
  }

  ionViewDidEnter() {
    //console.log("ionViewDidEnter");
    this.loadData();
    //this.scrollToBottom();
  }

  modalImageFinder(index: number) {
    //console.log(index)
    this.selectedImage = this.listData[index][3];

    this.selectedDate = this.listData[index][4];
    this.selectedAmount = this.listData[index][1];
    this.selectedDescription = this.listData[index][0];
    this.selectedImageDate = this.listData[index][5];

    this.modal.present();
  }

  async loadData() {
    this.currentTotalExpenses == 0;
    //console.log('loading data...')
    this.dataService.getData().subscribe(res => {
      this.listData = res;
      this.getRunningTotal();
    })
  }

  async removeItem(index: number) {
    this.dataService.removeItem(index);
    this.listData.splice(index, 1);
    //now trigger total function to re-update 
    this.getRunningTotal();
  }

  currentTotalExpenses: number = 0;
  count: number = 0;

  async getRunningTotal() {
    this.count = 0;
    for (let i = 0; i < this.listData.length; i++) {
      this.count += this.listData[i][1];
    }
    this.currentTotalExpenses = this.count;
  }

}