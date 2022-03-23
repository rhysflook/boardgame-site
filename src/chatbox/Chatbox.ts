import { GameSocket } from '../socket/GameSocket';
import { getTemplate } from '../templates/invite';
import { Message } from './Message';

export class Chatbox extends HTMLElement {
  messageBox: HTMLElement;
  textInput: HTMLTextAreaElement;
  sendButton: HTMLElement;
  constructor(public socket: GameSocket) {
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
  }

  handleMessage = (message: string, sender: string): void => {
    this.messageBox.appendChild(
      new Message(message, sender, false).renderMessage()
    );
  };

  sendMessage = (): void => {
    this.messageBox.appendChild(
      new Message(this.textInput.value, 'Billiam', true).renderMessage()
    );
    this.socket.send(
      JSON.stringify({
        type: 'chat',
        content: this.textInput.value,
        sender: 'Billiam',
      })
    );
    this.textInput.value = '';
  };
}

customElements.define('x-chatbox', Chatbox);
