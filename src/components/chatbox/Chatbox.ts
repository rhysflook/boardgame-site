import { capitalise } from '../../game/utils';
import { GameSocket } from '../../socket/GameSocket';
import { BaseComponent } from '../BaseComponent';
import { convertStyles } from '../styles';
import { Message } from './Message';

const css = `
.chat-box {
  width: 100%;
  background-color: var(--button-colour);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 5px var(--fancy-shadow-colour) outset;
}
.messages {
  padding-top: 40px;
  padding-bottom: 20px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.type-area {
  min-height: 50%;
  display: flex;
  width: 100%;
}

.type-input {
  height: 100%;
  width: 100%;
  padding: 2px;
  background-color: var(--component-bg-colour);
  border-top: 3px outset var(--component-border-colour);
  box-shadow: 0 -5px 3px var(--component-shadow-colour);
}

@media (min-width: 600px) {
  .chat-box {
      border-radius: 15px;
      width: 90%;  
      height: 100%;
    }
  } 
  .messages {
    padding: 2% 4%;
    height: 79%;
  }
  .type-area {
    height: 20%;
  }
  .type-input {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;

export class Chatbox extends BaseComponent {
  largeHtml = `
  <style>${css}</style>
  <div id="chat-box" class="chat-box">
      <div id="messages" class="messages"></div>
      <div id="type-area" class="type-area">
      <div id="type-input" class="flex-column-center type-input">
        <textarea id="new-message"></textarea>
        <button id="send-message" class="base-button">^</button>
      </div>
      </div>
  </div>
`;
  closedHtml = `
<link rel="stylesheet" href="../../menu.css">
<link rel="stylesheet" href="../../styles/gameChat.css">
  <button class="base-button short game-chat-closed" id="open-chat">Chat</button>
`;
  html = window.innerWidth < 600 ? this.closedHtml : this.largeHtml;

  messageBox: HTMLElement | null = null;
  textInput: HTMLTextAreaElement | null = null;
  isOpen: boolean = true;
  messages: HTMLElement[] = [];
  lastSender: string = '';

  constructor(public socket: GameSocket | null = null) {
    super();
    console.log(
      convertStyles({ backgroundColor: 'var(--component-bg-colour)' })
    );
    this.className = window.innerWidth < 600 ? 'chat-ele-closed' : 'chat-ele';
    this.render(this.html);

    this.setHandlers();
    const chatArea = document.getElementById('chat-menu');
    if (chatArea) {
      chatArea.appendChild(this);
    }
    const menu = document.getElementById('chat-menu') as HTMLElement;
    if (window.innerWidth < 600) {
      menu.classList.add('notVisible');
      this.isOpen = false;
      this.getByIdAndBind('open-chat', 'click', () => {
        this.toggleChat();
      });
    } else {
      menu.classList.add('visible');
    }
  }

  toggleChat = (): void => {
    const menu = document.getElementById('chat-menu') as HTMLElement;
    if (this.isOpen) {
      menu.classList.remove('visible');
      menu.classList.add('notVisible');
      this.className = 'chat-ele-closed';
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = this.closedHtml;
      }
      this.isOpen = !this.isOpen;
      this.getByIdAndBind('open-chat', 'click', () => {
        this.toggleChat();
      });
    } else {
      menu.classList.remove('notVisible');
      menu.classList.add('visible');
      this.className = 'chat-ele';
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = this.largeHtml;
      }
      this.isOpen = !this.isOpen;
      const box = this.getById('chat-box');
      const button = document.createElement('div');
      button.innerHTML = `
        <button id="close" class="base-button short floating">✕</button>
      `;
      box?.appendChild(button);
      button.addEventListener('click', () => {
        this.toggleChat();
      });
      this.setHandlers();
      this.messages.forEach((message) => {
        this.messageBox?.appendChild(message);
      });
    }
  };

  setHandlers = (): void => {
    this.messageBox = this.getById('messages') as HTMLElement;
    this.textInput = this.getById('new-message') as HTMLTextAreaElement;
    this.getByIdAndBind('send-message', 'click', () => this.sendMessage());
  };

  handleMessage = (message: string, sender: string): void => {
    const chatMessage = new Message(
      message,
      capitalise(sender),
      false,
      this.lastSender === localStorage.getItem('username')
    ).renderMessage();
    this.lastSender = sender;
    this.messages.push(chatMessage);
    this.messageBox?.appendChild(chatMessage);
  };

  sendMessage = (): void => {
    const message =
      this.textInput !== null ? (this.textInput.value as string) : '';
    const chatMessage = new Message(
      message,
      capitalise(localStorage.getItem('username') as string),
      true,
      this.lastSender === localStorage.getItem('username')
    ).renderMessage();
    this.lastSender = localStorage.getItem('username') as string;
    this.messages.push(chatMessage);
    this.messageBox?.appendChild(chatMessage);
    this.socket?.sendMessage(message);
    if (this.textInput) {
      this.textInput.value = '';
    }
  };
}

customElements.define('x-chatbox', Chatbox);
