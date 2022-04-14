import { capitalise } from '../../game/utils';
import { GameSocket } from '../../socket/GameSocket';
import { BaseComponent } from '../BaseComponent';
import { Message } from './Message';

export class Chatbox extends BaseComponent {
  html = `
  <link rel="stylesheet" href="../../menu.css">
  <div id="chat-box">
      <div id="messages"></div>
      <div id="type-area">
      <div id="type-input">
        <textarea id="new-message"></textarea>
        <button id="send-message" class="popup-button">^</button>
      </div>
      </div>
  </div>
`;

  messageBox: HTMLElement;
  textInput: HTMLTextAreaElement;

  constructor(public socket: GameSocket | null = null) {
    super();
    this.render(this.html);
    this.messageBox = this.getById('messages') as HTMLElement;
    this.textInput = this.getById('new-message') as HTMLTextAreaElement;
    this.getByIdAndBind('send-message', 'click', () => this.sendMessage());

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

  sendMessage = (): void => {
    this.messageBox.appendChild(
      new Message(
        this.textInput.value,
        capitalise(localStorage.getItem('username') as string),
        true
      ).renderMessage()
    );
    this.socket?.sendMessage(this.textInput.value);
    this.textInput.value = '';
  };
}

customElements.define('x-chatbox', Chatbox);
