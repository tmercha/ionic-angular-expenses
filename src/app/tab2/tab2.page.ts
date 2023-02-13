import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Photo, Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
//import { parse } from 'path';
//import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  selectedImage: any;
  photoBase64Data: any;
  photoFileName: any;
  alertCtrl: any;

  temporaryPhotoDisplay: any;

  takenState: boolean = true;
  takePhotoText: string = "Take Photo";

  description: any = [];
  amount: any = [];
  date: any = [];

  photoDate: any;
  //photoSplitDate: any;
  //photoSplitTime: any;
  //photoDateCombined: any;

  constructor(private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    //console.log('oninit');
    this.temporaryPhotoDisplay = 'assets/placeholderimage.png';
  }
  //check if we are on web platform, if so will need to handle image differently 
  checkPlatformWeb() {
    if (Capacitor.getPlatform() == 'web') return true;
    return false;
  }

  public async takePicture() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: this.checkPlatformWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    this.takenState = false;
    this.takePhotoText = 'Retake Photo'
    this.selectedImage = capturedPhoto;

    //manage if on web 
    if (this.checkPlatformWeb()) this.selectedImage.webPath = capturedPhoto.dataUrl;

    //get datetime in readable format so user knows when the photo was taken. 
    //although photo filename is the timestamp it is not very readable! 
    this.photoDate = new Date();
    //console.log(this.photoDate);
    //split down further 
    //this.photoSplitDate = this.photoDate.toLocaleDateString("en-GB");
    //this.photoSplitTime = this.photoDate.toLocaleTimeString("it-IT");
    //this.photoDateCombined = this.photoSplitDate + " " + this.photoSplitTime;
    //console.log(this.photoDateCombined);

    //now move on 
    this.holdPicture(capturedPhoto);
  }

  private async holdPicture(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    this.temporaryPhotoDisplay = base64Data;
    //save photo with timestamp of when taken as file name
    const fileName = new Date().getTime() + '.jpeg';
    //console.log('FILENAME');
    console.log(fileName);
    this.photoBase64Data = base64Data;
    this.photoFileName = fileName;
  }

  private async readAsBase64(photo: Photo) {
    //fetch photo, read as blob, then convert to base 64
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async presentAlert(type: string, header: string) {
    const alert = await this.alertController.create({
      header: header,
      message: '<p>' + type,
      buttons: ['OK'],
    });

    await alert.present();
    const { data } = await alert.onDidDismiss();

    if (data && header == 'Success') {
      //used to reload window but was clunky and interrupted experience.
      //now user resetForm function to reset form values 
      //window.location.reload();
      //console.log('resetting now');
      this.resetForm();
    }
  }
  amountToNumber: any;

  //add data and show appropriate alert
  async onSubmit() {
    //first convert the amount value to a number
    //this means we can use it properly for future calculations like the expenses total
    this.amountToNumber = Number(this.amount);
    //now catch any empty fields before submitting to database
    if (this.description == "") {
      this.presentAlert('Please include a description of the expense.', 'Incomplete Entry');
    } else if (this.amount == "") {
      this.presentAlert('Please include an expense amount.', 'Incomplete Entry');
    } else if (this.date == "") {
      this.presentAlert('Please include date the expense was incurred.', 'Incomplete Entry');
    } else if (this.photoFileName == undefined || this.photoBase64Data == undefined) {
      this.presentAlert('Please include a picture of the reciept for your records.', 'Incomplete Entry');
    } else {
      await this.dataService.addData([this.description, this.amountToNumber, this.photoFileName, this.photoBase64Data, this.date, this.photoDate]);
      await this.presentAlert('Entry successfully added.', 'Success')
    }
  }

  //reset all form values to allow user to send again 
  async resetForm() {
    this.description = "";
    this.amount = "";
    this.date = "";
    this.photoFileName = undefined;
    this.photoBase64Data = undefined;
    this.photoDate = "";
    this.temporaryPhotoDisplay = 'assets/placeholderimage.png';
    //reset the take photo button too
    this.takenState = true;
    this.takePhotoText = 'Take Photo'
  }

}