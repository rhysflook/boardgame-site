import { capitalise } from '../../game/utils';
import { GameSocket } from '../../socket/GameSocket';
import { getTemplate } from '../../templates/invite';
import { Message } from './Message';

export class Chatbox extends HTMLElement {
  messageBox: HTMLElement;
  textInput: HTMLTextAreaElement;
  sendButton: HTMLElement;
  constructor(public socket: GameSocket | null = null) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(getTemplate('chatBox'));
    this.messageBox = this.shadowRoot?.getElementById(
      'messages'
    ) as HTMLElement;
    this.textInput = this.shadowRoot?.getElementById(
      'new-message'
    ) as HTMLTextAreaElement;
    this.sendButton = this.shadowRoot?.getElementById(
      'send-message'
    ) as HTMLElement;
    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });

    if (this.socket) {
      this.connectChatbox();
    }

    const chatArea = document.getElementById('chat-menu');
    if (chatArea) {
      chatArea.appendChild(this);
    }
  }

  handleMessage = (message: string, sender: string): void => {
    this.messageBox.appendChild(
      new Message(message, capitalise(sender), false).renderMessage()
    );
  };

  connectChatbox = (): void => {
    if (this.socket) {
      this.socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          this.handleMessage(data.message, data.sender);
        }
      });
    }
  };

  sendMessage = (): void => {
    this.messageBox.appendChild(
      new Message(
        this.textInput.value,
        capitalise(localStorage.getItem('username') as string),
        true
      ).renderMessage()
    );
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          type: 'chat',
          message: this.textInput.value,
          sender: localStorage.getItem('username'),
        })
      );
    }
    this.textInput.value = '';
  };
}

customElements.define('x-chatbox', Chatbox);
