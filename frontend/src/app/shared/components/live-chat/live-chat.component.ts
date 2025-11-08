import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  animations: [
    trigger('slideUp', [
      state('closed', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('open', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('closed => open', [
        animate('300ms ease-in-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('bounce', [
      transition(':enter', [
        style({ transform: 'scale(0.3)', opacity: 0 }),
        animate('300ms cubic-bezier(.68,-0.55,.265,1.55)', 
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ])
    ])
  ],
  template: `
    <!-- Floating Chat Button -->
    <div class="chat-container">
      <button 
        *ngIf="!isOpen" 
        mat-fab 
        color="primary" 
        class="chat-toggle-btn"
        (click)="toggleChat()"
        [@bounce]
        [matBadge]="unreadCount"
        [matBadgeHidden]="unreadCount === 0"
        matBadgeColor="warn">
        <mat-icon>chat</mat-icon>
      </button>

      <!-- Chat Modal -->
      <div 
        class="chat-modal" 
        [@slideUp]="isOpen ? 'open' : 'closed'"
        *ngIf="isOpen || isAnimating">
        
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="avatar">
              <mat-icon>support_agent</mat-icon>
            </div>
            <div class="agent-info">
              <h3>AI Support Assistant</h3>
              <p class="status">
                <span class="online-indicator"></span>
                Online - Usually replies instantly
              </p>
            </div>
          </div>
          <div class="chat-actions">
            <button mat-icon-button (click)="minimizeChat()" matTooltip="Minimize">
              <mat-icon>minimize</mat-icon>
            </button>
            <button mat-icon-button (click)="closeChat()" matTooltip="Close">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" #chatContainer>
          <div class="welcome-message" *ngIf="messages.length === 0">
            <div class="welcome-avatar">
              <mat-icon>support_agent</mat-icon>
            </div>
            <h3>Hi! 👋</h3>
            <p>I'm your AI assistant. I can help you with:</p>
            <ul>
              <li>Account and profile questions</li>
              <li>Course enrollment assistance</li>
              <li>Technical support</li>
              <li>General platform guidance</li>
            </ul>
            <p>How can I help you today?</p>
          </div>

          <div class="message-container" *ngFor="let message of messages; trackBy: trackByMessageId">
            <div class="message" [ngClass]="{'user': message.sender === 'user', 'bot': message.sender === 'bot'}">
              <div class="message-content">
                <div class="message-avatar" *ngIf="message.sender === 'bot'">
                  <mat-icon>support_agent</mat-icon>
                </div>
                <div class="message-bubble">
                  <p [innerHTML]="formatMessage(message.text)"></p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
                <div class="message-avatar user-avatar" *ngIf="message.sender === 'user'">
                  <mat-icon>person</mat-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div class="typing-indicator" *ngIf="isTyping">
            <div class="message bot">
              <div class="message-content">
                <div class="message-avatar">
                  <mat-icon>support_agent</mat-icon>
                </div>
                <div class="message-bubble typing">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Suggestions -->
        <div class="quick-suggestions" *ngIf="showSuggestions && suggestions.length > 0">
          <button 
            mat-button 
            *ngFor="let suggestion of suggestions"
            (click)="sendSuggestion(suggestion)"
            class="suggestion-btn">
            {{ suggestion }}
          </button>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-container">
          <mat-form-field appearance="outline" class="chat-input">
            <input 
              matInput 
              [(ngModel)]="currentMessage" 
              (keydown.enter)="sendMessage()"
              [disabled]="isTyping"
              placeholder="Type your message..."
              #messageInput>
            <button 
              mat-icon-button 
              matSuffix 
              (click)="sendMessage()"
              [disabled]="!currentMessage.trim() || isTyping">
              <mat-icon>send</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <!-- Footer -->
        <div class="chat-footer">
          <p>Powered by AI • LMS Support</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    }

    .chat-toggle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(0,0,0,0.2);
    }

    .chat-modal {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 16px 16px 4px 4px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }

    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .agent-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .status {
      margin: 4px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .online-indicator {
      width: 8px;
      height: 8px;
      background: #4caf50;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }

    .chat-actions {
      display: flex;
      gap: 4px;
    }

    .chat-actions button {
      color: white;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f9f9f9;
    }

    .welcome-message {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .welcome-avatar {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .welcome-message h3 {
      margin: 0 0 12px 0;
      color: #333;
    }

    .welcome-message p {
      margin: 8px 0;
      color: #666;
    }

    .welcome-message ul {
      text-align: left;
      margin: 12px 0;
      padding-left: 20px;
    }

    .welcome-message li {
      color: #666;
      margin: 4px 0;
    }

    .message-container {
      margin: 12px 0;
    }

    .message {
      display: flex;
      width: 100%;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.bot {
      justify-content: flex-start;
    }

    .message-content {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      max-width: 85%;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .user-avatar {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    }

    .message-bubble {
      background: white;
      padding: 12px 16px;
      border-radius: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
    }

    .message.user .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .message-bubble p {
      margin: 0;
      line-height: 1.4;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
      display: block;
      margin-top: 4px;
    }

    .typing-indicator .message-bubble {
      background: white;
      padding: 16px;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
    }

    .typing-dots span {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .quick-suggestions {
      padding: 8px 16px;
      background: white;
      border-top: 1px solid #e0e0e0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .suggestion-btn {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 16px;
      background: #f0f0f0;
      border: 1px solid #ddd;
    }

    .suggestion-btn:hover {
      background: #e0e0e0;
    }

    .chat-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #e0e0e0;
    }

    .chat-input {
      width: 100%;
    }

    .chat-input .mat-form-field-wrapper {
      padding-bottom: 0;
    }

    .chat-footer {
      background: #f5f5f5;
      padding: 8px 16px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }

    .chat-footer p {
      margin: 0;
      font-size: 11px;
      color: #999;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .chat-modal {
        width: calc(100vw - 40px);
        height: 70vh;
      }
      
      .chat-toggle-btn {
        bottom: 80px;
      }
    }

    /* Scrollbar Styling */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  `]
})
export class LiveChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isOpen = false;
  isAnimating = false;
  isTyping = false;
  currentMessage = '';
  messages: ChatMessage[] = [];
  unreadCount = 0;
  showSuggestions = true;
  
  suggestions = [
    "How do I reset my password?",
    "How to enroll in a course?",
    "View my grades",
    "Contact support"
  ];

  private shouldScrollToBottom = false;

  // AI Knowledge Base for responses
  private knowledgeBase = {
    password: [
      "To reset your password:\n1. Go to the login page\n2. Click 'Forgot Password'\n3. Enter your email\n4. Check your email for reset link\n5. Follow the instructions in the email",
      "You can also change your password from your profile settings after logging in."
    ],
    course: [
      "To enroll in a course:\n1. Go to the Courses section\n2. Browse or search for courses\n3. Click on the course you want\n4. Click 'Enroll Now'\n5. Complete payment if required",
      "Some courses may have prerequisites. Check the course details before enrolling."
    ],
    grades: [
      "To view your grades:\n1. Go to your Student Dashboard\n2. Click on 'Results' or 'Assessment Results'\n3. You can see grades for all completed assessments",
      "Grades are updated automatically after assessment completion."
    ],
    profile: [
      "To update your profile:\n1. Click on your avatar in the top right\n2. Select 'Profile'\n3. Edit your information\n4. Click 'Save Changes'",
      "Make sure to keep your contact information up to date."
    ],
    support: [
      "You can contact support via:\n📧 Email: support&#64;lms-rguhs.edu.in\n📞 Phone: +91-80-12345678\n🕒 Hours: 9 AM - 6 PM (Mon-Fri)",
      "I'm here 24/7 to help with common questions!"
    ],
    login: [
      "Having trouble logging in?\n1. Check your email and password\n2. Ensure Caps Lock is off\n3. Try resetting your password\n4. Clear browser cache\n5. Contact support if issues persist"
    ],
    assignment: [
      "For assignments:\n1. Go to 'Assignments' in your dashboard\n2. Click on the assignment you want to submit\n3. Upload your file or write your answer\n4. Click 'Submit'\n5. You'll get a confirmation"
    ]
  };

  ngOnInit() {
    // Simulate initial unread messages
    setTimeout(() => {
      this.unreadCount = 1;
    }, 5000);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.isAnimating = true;
    this.unreadCount = 0;
    
    setTimeout(() => {
      this.isAnimating = false;
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 300);
  }

  closeChat() {
    this.isAnimating = true;
    this.isOpen = false;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  minimizeChat() {
    this.closeChat();
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isTyping) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: this.currentMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;
    this.showSuggestions = false;

    const messageText = this.currentMessage.toLowerCase();
    this.currentMessage = '';
    
    // Simulate typing delay
    this.isTyping = true;
    
    setTimeout(() => {
      const response = this.generateResponse(messageText);
      const botMessage: ChatMessage = {
        id: this.generateId(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      this.messages.push(botMessage);
      this.isTyping = false;
      this.shouldScrollToBottom = true;
      
      // Update suggestions based on context
      this.updateSuggestions(messageText);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  }

  sendSuggestion(suggestion: string) {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  private generateResponse(message: string): string {
    // Simple keyword matching for responses
    const keywords = message.toLowerCase();
    
    if (keywords.includes('password') || keywords.includes('reset')) {
      return this.getRandomResponse('password');
    } else if (keywords.includes('course') || keywords.includes('enroll')) {
      return this.getRandomResponse('course');
    } else if (keywords.includes('grade') || keywords.includes('result') || keywords.includes('score')) {
      return this.getRandomResponse('grades');
    } else if (keywords.includes('profile') || keywords.includes('update') || keywords.includes('edit')) {
      return this.getRandomResponse('profile');
    } else if (keywords.includes('support') || keywords.includes('contact') || keywords.includes('help')) {
      return this.getRandomResponse('support');
    } else if (keywords.includes('login') || keywords.includes('sign in') || keywords.includes('access')) {
      return this.getRandomResponse('login');
    } else if (keywords.includes('assignment') || keywords.includes('submit') || keywords.includes('homework')) {
      return this.getRandomResponse('assignment');
    } else if (keywords.includes('hi') || keywords.includes('hello') || keywords.includes('hey')) {
      return "Hello! 👋 I'm here to help you with any questions about the LMS platform. What can I assist you with today?";
    } else if (keywords.includes('thank') || keywords.includes('thanks')) {
      return "You're welcome! 😊 Is there anything else I can help you with?";
    } else {
      return this.getGenericResponse();
    }
  }

  private getRandomResponse(category: keyof typeof this.knowledgeBase): string {
    const responses = this.knowledgeBase[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGenericResponse(): string {
    const responses = [
      "I'd be happy to help! Could you please provide more details about what you're looking for?",
      "I'm not sure I understand. Could you rephrase your question? You can also try one of the suggestions below.",
      "That's an interesting question! For specific issues, you might want to contact our support team, or I can help with common platform questions.",
      "I'm here to help with LMS-related questions. Could you be more specific about what you need assistance with?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private updateSuggestions(lastMessage: string) {
    if (lastMessage.includes('password')) {
      this.suggestions = ["Change password from profile", "Login troubleshooting", "Account security"];
    } else if (lastMessage.includes('course')) {
      this.suggestions = ["View available courses", "Check prerequisites", "Payment options"];
    } else if (lastMessage.includes('grade')) {
      this.suggestions = ["View certificates", "Download transcripts", "Assessment dates"];
    } else {
      this.suggestions = [
        "How do I reset my password?",
        "How to enroll in a course?",
        "View my grades",
        "Contact support"
      ];
    }
    this.showSuggestions = true;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  formatMessage(text: string): string {
    // Convert newlines to <br> tags and add basic formatting
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timestamp.toLocaleDateString();
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  private scrollToBottom() {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}