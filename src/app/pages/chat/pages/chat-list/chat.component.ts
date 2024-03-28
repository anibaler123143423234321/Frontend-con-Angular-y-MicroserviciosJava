import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from '@app/models/backend/chat/chat-message';
import { ChatService } from '@app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageInput: string = '';
  userId: string = '';
  userName: string = ''; // Nuevo campo para almacenar el nombre del usuario
  userLastName: string = ''; // Nuevo campo para almacenar el apellido del usuario
  messageList: any[] = [];
  userList: string[] = [];

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    this.chatService.joinRoom("ABC");
    this.lisenerMessage();
    this.lisenerUserList(); // Add this line to subscribe to user list changes
  }

  sendMessage() {
    const chatMessage = {
      message: this.messageInput,
      userId: this.userId,
      nombre: this.userName,
      apellido: this.userLastName,
      message_side: 'sender' // Establecer el lado del mensaje como 'sender'
    } as ChatMessage;
    this.chatService.sendMessage("ABC", chatMessage);
    this.messageInput = '';
  }

  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      this.messageList = messages.map((item: any) => ({
        ...item,
        message_side: item.userId === this.userId ? 'sender' : 'receiver' // Actualizar message_side en función de userId
      }));
    });
  }


  lisenerUserList() {
    this.chatService.getUserListSubject().subscribe((users: string[]) => {
      this.userList = users;
      console.log("User list in component: ", this.userList);
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}
