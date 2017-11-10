import { Component, OnInit, ViewChild, AfterViewInit,Output, EventEmitter } from '@angular/core';
declare var require: any;
let RecordRTC = require('recordrtc/RecordRTC.min');

@Component({
  selector: 'app-video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.css']
})
export class VideoRecordComponent implements OnInit, AfterViewInit {

  public stream: MediaStream;
  public recordRTC: any;
  public recordRTCPromise: any;
  public isRecording: boolean = false;
  public isRecordingCompleted: boolean = false;
  public recordedBlob: any;

  @Output()
  public onSubmission =  new EventEmitter<any>();

  @ViewChild('video') video;
  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    // set the initial state of the video
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    this.isRecording = true;
    this.isRecordingCompleted = false;
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    this.toggleControls();
  }

  errorCallback() {
    alert('No Media device found')
    //handle error here
  }

  processVideo(audioVideoWebMURL) {
    let video: HTMLVideoElement = this.video.nativeElement;
    let recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    this.recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function (dataURL) { });
    
  }

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          advanced: [{
            width: 1280,
            height: 720
          }
          ]
        },
        audio: true
      })
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    this.isRecording = false;
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    this.isRecordingCompleted = true;
  }

  submitRecording() {
    this.isRecordingCompleted = false;
    // this.recordRTC.save('video.webm');
    this.onSubmission.emit(this.recordedBlob);
  }

}
