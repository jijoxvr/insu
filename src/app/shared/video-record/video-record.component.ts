import { Component, OnInit, ViewChild, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
declare var require: any;
let RecordRTC = require('recordrtc/RecordRTC.min');
declare var $: any;

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
  isSourcePlaying = false;
  submitMessage = "To submit please record a video greater than 15 seconds"
  @Output()
  public onSubmission =  new EventEmitter<any>();

  @Input()
  public source: any;

  @ViewChild('video') video;
  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
    
    // set the initial state of the video
    if(this.source){
      let video: HTMLVideoElement = this.video.nativeElement;
      video.src = this.source;
      video.play();
      this.isRecording = false;
      this.isSourcePlaying = true;
    }else{
      this.initRecorder();
    }
    
  }

  stopAndClose(){
    let video: HTMLVideoElement = this.video.nativeElement;
    video.pause();
    this.isSourcePlaying = false;
    $('#playModal').modal('toggle');
    this.onSubmission.emit();
  }

  initRecorder(){
    this.submitMessage = "To submit please record a video greater than 15 seconds"
    let video: HTMLVideoElement = this.video.nativeElement;
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
    $('[data-toggle="tooltip"]').tooltip();
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
  }

  playVideo(){
    let video: HTMLVideoElement = this.video.nativeElement;
    video.play();    
  }

  recordAgain(){
    this.isRecording = false;
    this.isRecordingCompleted = false;
    this.initRecorder();
    this.timer = 0;
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
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(this.stream);
  }
  timer = 0;
  counter : any; 
  startRecording(){
    this.timer = 0;
    this.recordRTC.startRecording();
    this.counter = this.triggerTimer();
    this.isRecording = true;
    this.isRecordingCompleted = false;
    this.toggleControls();
  }

  triggerTimer(){
    return setInterval(()=>{
      this.timer += 1;
      if(this.timer > 57){
        this.stopRecording();
      }
      if(this.timer > 14)
        this.submitMessage = "Click here to submit video"
    }, 1000);
  }


  errorCallback() {
    this.onSubmission.emit(false)
    alert('Unable to detect Media device')
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


  stopRecording() {
    this.isRecording = false;
    clearInterval(this.counter);
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    this.isRecordingCompleted = true;
    $('[data-toggle="tooltip"]').tooltip();
  }

  submitRecording() {
    if(this.timer > 15){
      this.isRecordingCompleted = false;
      this.onSubmission.emit(this.recordedBlob);
    }
    // this.recordRTC.save('video.webm');
  }

}
