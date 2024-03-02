  import { Injectable } from '@angular/core';
  import SockJS from 'sockjs-client';
  import { Stomp } from '@stomp/stompjs';
  import { ChatMessage } from '@app/models/backend/chat/chat-message';
  import { BehaviorSubject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ChatService {
    private stompClient: any;
    private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
    private userListSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    constructor() {
      this.initConnectionSocket();
    }

    initConnectionSocket() {
      const url = 'https://dotval-app-6908ca550bb8.herokuapp.com/chat-socket';
      const socket = new SockJS(url);
      this.stompClient = Stomp.over(socket);
    }

    joinRoom(roomId: string) {
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
          const messageContent = JSON.parse(messages.body);
          const currentMessage = this.messageSubject.getValue();
          currentMessage.push(messageContent);
          console.log(messageContent)
          this.messageSubject.next(currentMessage);
        });

        // Suscribirse al tema de la lista de usuarios
        this.stompClient.subscribe(`/topic/userList/${roomId}`, (userList: any) => {
          const users = JSON.parse(userList.body);
          this.userListSubject.next(users);
        });
      });
    }

    sendMessage(roomId: string, chatMessage: ChatMessage) {
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    }

    getMessageSubject() {
      return this.messageSubject.asObservable();
    }

    getUserListSubject() {
      return this.userListSubject.asObservable();
    }
  }
