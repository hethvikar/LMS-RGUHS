import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../core/services/auth.service';

interface LiveInterview {
  id: number;
  companyName: string;
  position: string;
  startTime: Date;
  interviewer: string;
  channelId?: string;
  status: 'live' | 'starting_soon' | 'ended';
}

interface MessageItem {
  text: string;
  type: 'system' | 'info' | 'user' | 'error';
}

@Component({
  selector: 'app-live-interview',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './live-interview.component.html',
  styleUrls: ['./live-interview.component.scss']
})
export class LiveInterviewComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() interview: LiveInterview | null = null;
  @Output() joinClick = new EventEmitter<LiveInterview>();
  @Output() leaveClick = new EventEmitter<LiveInterview>();

  @ViewChild('videosContainer', { static: false }) videosContainer!: ElementRef;
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;

  isLive = false;
  elapsedTime = '00:00';
  public messages: MessageItem[] = [];
  currentUserName: string = 'User';
  private intervalId: any;
  private ws: WebSocket;
  private localStream: MediaStream | null = null;
  private peers: { [key: string]: RTCPeerConnection } = {};
  private config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  constructor(private authService: AuthService) { 
    this.loadCurrentUserName();
    this.ws = new WebSocket("wss://report.vetpawslab.com/ws");
  }

  private loadCurrentUserName(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.firstName) {
      this.currentUserName = currentUser.firstName;
    }
  }

  ngOnInit() {

    if(this.interview==null){
     this.interview = {
      id: 1,
      companyName: "Company Name",
      position: "Position",
      startTime: new Date(),
      interviewer: "Interviewer",
      channelId: "scheduledinterview1",
      status: 'live'
     }
    }

    if (this.interview) {
      this.isLive = this.interview.status === 'live';
      if (this.isLive) {
        this.startTimer();
      }
    }
  }

  ngAfterViewInit() {
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onmessage = async (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      switch (data.type) {
        case "peers":
          if (data.peers.length) {
            this.addMessage(`Peers already in room: ${data.peers.join(", ")}`, "info");
            for (const peer of data.peers)
              await this.createPeer(peer, true);
          }
          break;
        case "new-peer":
          this.addMessage(`${data.name} joined the room`, "info");
          await this.createPeer(data.name, false);
          break;
        case "offer":
          await this.handleOffer(data);
          break;
        case "answer":
          await this.peers[data.from]?.setRemoteDescription({ type: "answer", sdp: data.sdp });
          //this.addMessage(`Received answer from ${data.from}`, "info");
          break;
        case "candidate":
          try {
            await this.peers[data.from]?.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (err) {
            console.warn("Bad ICE:", err);
          }
          break;
        case "peer-left":
          this.addMessage(`${data.name} left the room`, "info");
          this.removeVideo(data.name);
          this.peers[data.name]?.close();
          delete this.peers[data.name];
          break;
      }
    };
  }

  private addVideo(stream: MediaStream, name: string, muted: boolean = false) {
    if (!this.videosContainer) return;
    if (this.videosContainer.nativeElement.querySelector(`#video-${name}`)) return;
    const wrapper = document.createElement("div");
    const video = document.createElement("video");
    video.id = `video-${name}`;
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = muted;
    wrapper.appendChild(video);
    const label = document.createElement("div");
    label.textContent = name;
    wrapper.appendChild(label);
    this.videosContainer.nativeElement.appendChild(wrapper);
  }

  private removeVideo(name: string) {
    if (!this.videosContainer) return;
    const el = this.videosContainer.nativeElement.querySelector(`#video-${name}`);
    if (el) el.parentElement?.remove();
  }

  private async createPeer(peerName: string, isInitiator: boolean) {
    if (this.peers[peerName]) return;
    const pc = new RTCPeerConnection(this.config);
    this.peers[peerName] = pc;
    if (this.localStream) {
      this.localStream.getTracks().forEach((t: MediaStreamTrack) => pc.addTrack(t, this.localStream!));
    }
    pc.ontrack = (e: RTCTrackEvent) => this.addVideo(e.streams[0], peerName);
    pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate)
        this.ws.send(JSON.stringify({ type: "candidate", target: peerName, candidate: e.candidate }));
    };
    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.ws.send(JSON.stringify({ type: "offer", target: peerName, sdp: offer.sdp }));
      //this.addMessage(`Sent offer to ${peerName}`, "info");
    }
  }

  private async handleOffer(data: any) {
    const from = data.from;
    if (!this.peers[from]) await this.createPeer(from, false);
    await this.peers[from].setRemoteDescription({ type: "offer", sdp: data.sdp });
    const answer = await this.peers[from].createAnswer();
    await this.peers[from].setLocalDescription(answer);
    this.ws.send(JSON.stringify({ type: "answer", target: from, sdp: answer.sdp }));
    //this.addMessage(`Sent answer to ${from}`, "info");
  }

  ngOnDestroy() {
    this.stopTimer();
    this.cleanupWebRTC();
    if (this.ws) {
      this.ws.close();
    }
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this.updateElapsedTime();
    }, 1000);
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateElapsedTime() {
    if (!this.interview) return;

    const elapsed = Math.floor((new Date().getTime() - this.interview.startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.elapsedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  onJoinClick() {
    if (this.interview) {
      this.initializeWebRTC();
      this.joinClick.emit(this.interview);
    }
  }

  private initializeWebRTC() {
    if (!this.interview?.channelId) {
      console.error('Channel ID not available for WebRTC');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      console.log('Local stream obtained:', stream);
      this.localStream = stream;
      // Add local video
      this.addVideo(stream, this.currentUserName, true);
      // Send join message after getting stream
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'join',
          name: this.currentUserName,
          room: this.interview?.channelId
        }));
        this.addMessage(`You joined interview room as ${this.currentUserName}`, 'info');
      }
    })
    .catch(error => {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      alert(`Cannot access camera/microphone: ${error.name} - ${error.message}`);
    });
  }



  addMessage(text: string, type: 'system' | 'info' | 'user' | 'error' = 'system') {
    const messageItem: MessageItem = {
      text,
      type
    };
    this.messages.push(messageItem);

    console.log(`Message [${type}]: ${text}`);
  }

  onLeaveClick() {
    if (this.interview) {
      // Send leave message
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'leave',
          name: this.currentUserName,
          room: this.interview.channelId
        }));
      }
      // Clean up WebRTC connections
      this.cleanupWebRTC();
      this.stopTimer();
      this.leaveClick.emit(this.interview);
    }
  }

  private cleanupWebRTC() {
    // Close all peer connections
    Object.values(this.peers).forEach(pc => pc.close());
    this.peers = {};
    // Stop local media stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    // Clear videos from DOM
    if (this.videosContainer) {
      this.videosContainer.nativeElement.innerHTML = '';
    }
  }

  getStatusClass(): string {
    return this.interview?.status || '';
  }

  getStatusText(): string {
    const statusMap: { [key: string]: string } = {
      'live': 'Live Now',
      'starting_soon': 'Starting Soon',
      'ended': 'Ended'
    };
    return statusMap[this.interview?.status || ''] || 'Unknown';
  }
}
