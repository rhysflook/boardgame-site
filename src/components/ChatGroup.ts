import axios from '../../node_modules/axios/index';
import { Message } from './chatbox/Message';
import { capitalise } from '../game/utils';
import { SiteSocket } from '../socket/MenuSocket';
import { ChatControls } from '../menu/gameMenu';

export class ChatGroup extends HTMLElement {
  collapsed: boolean = true;
  chat: HTMLElement[] = [];
  localId: number;
  inputField: HTMLInputElement | null = null;
  message: string = '';
  dragging: boolean = false;
  size: DOMRect | null = null;
  lastSender: string = '';
  constructor(
    public socket: SiteSocket,
    public localUser: string,
    public groupName: string,
    public recipient_id: number,
    public parent: ChatControls,
    public isGlobal: boolean = true,
    public setUnread: boolean = false
  ) {
    super();

    this.id = this.groupName;
    this.className = 'chat-group-ele';
    const shadowRoot = this.attachShadow({ mode: 'open' });

    this.style.top = window.innerHeight - this.parent.numOfGroups * 40 + 'px';
    this.localId = Number(localStorage.getItem('id'));
    this.getChatHistory().then((res) => {
      res.data.forEach((message: any[]) => {
        this.storeAndDisplayMessage(message[1], message[2], false);
      });
      this.render();
      this.handleIncomingMessage();
      this.toggleChar();

      this.setUnread && this.setGroupUnread();
      this.addEvents();
    });
  }

  addEvents = (): void => {
    this.addEventListener('mousedown', (e) => this.dragStart(e));
    this.addEventListener('mouseup', () => this.dragEnd());

    document.body.addEventListener('mousemove', (e) => {
      if (this.dragging) {
        if (this.size) {
          this.style.left = e.clientX - this.size.width / 2 + 'px';
          this.style.top = e.clientY + this.size.height / 2 + 'px';
        }
      }
    });
  };

  setGroupUnread = (): void => {
    const button = this.shadowRoot?.getElementById('open');
    if (button) {
      button.classList.add('unread');
    }
  };

  getChatHistory = () => {
    if (this.isGlobal) {
      return axios.get(
        `../friends/getChatHistory.php?recipient_id=${this.recipient_id}}`
      );
    } else {
      return axios.get(
        `../friends/getSpecificChatHistory.php?recipient_id=${this.recipient_id}}&user_id=${this.localId}`
      );
    }
  };

  saveChatMessage = (id: number, sender: string, message: string) => {
    return axios.post('../friends/saveChat.php', {
      id,
      message,
      sender,
      recipient_id: this.recipient_id,
      is_read: false,
      date_sent: Math.floor(new Date().getTime() / 1000),
    });
  };

  handleIncomingMessage = () => {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (
        (data.type === 'chatMessage' &&
          data.recipient_id === this.localId &&
          data.sender_id === this.recipient_id) ||
        (data.recipient_id === 0 && this.recipient_id === 0)
      ) {
        this.collapsed && this.setGroupUnread();
        this.storeAndDisplayMessage(data.content, data.sender, !this.collapsed);
      }
      const chat = this.shadowRoot?.getElementById(
        `${this.groupName}-chat-inner`
      );
      if (chat) {
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
      }
    });
  };

  storeAndDisplayMessage = (
    content: string,
    sender: string,
    show: boolean
  ): void => {
    if (content !== '') {
      const message = new Message(
        content,
        capitalise(sender),
        sender === this.localUser,
        sender === this.lastSender
      );
      this.lastSender = sender;
      this.chat.push(message.renderMessage());
      show && this.displayMessage(message);
    }
  };

  displayMessage = (message: HTMLElement): void => {
    if (!this.collapsed) {
      const chatBox = this.shadowRoot?.getElementById(
        this.groupName + '-chat-inner'
      );
      if (chatBox) {
        chatBox.appendChild(message);
        this.scrollToBottom();
      }
    }
  };

  scrollToBottom = (): void => {
    const chat = this.shadowRoot?.getElementById(
      `${this.groupName}-chat-inner`
    );
    if (chat) {
      chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    }
  };

  sendMessage = (): void => {
    const chatInput = this.shadowRoot?.getElementById(
      'chatContent'
    ) as HTMLInputElement;

    this.saveChatMessage(this.localId, this.localUser, chatInput.value).then(
      () => {
        this.socket.send(
          JSON.stringify({
            type: 'chatMessage',
            content: chatInput.value,
            sender: this.localUser,
            id: this.localId,
            recipient_id: this.recipient_id,
            is_read: false,
            date_sent: Math.floor(new Date().getTime() / 1000),
          })
        );
        this.storeAndDisplayMessage(chatInput.value, this.localUser, true);
        this.message = '';
        chatInput.value = '';
      }
    );
  };

  toggleStyles = (button: HTMLElement): void => {
    const frame = this.shadowRoot?.getElementById('frame') as HTMLElement;
    const group = this.shadowRoot?.getElementById(
      `${this.groupName}`
    ) as HTMLElement;
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.inputField = null;
      button.innerText = `${this.groupName}`;
      button.className = 'chat-button-closed closed';
      frame.className = 'chat-group-inner-closed';
      group.className = 'chat-group-container-closed';
    } else {
      button.innerText = `-`;
      button.className = 'chat-button-open short open';
      frame.className = 'chat-group-inner-open';
      group.className = 'chat-group-container-open';
    }
  };

  toggleChar = (): void => {
    const button = this.shadowRoot?.getElementById('open');
    if (button) {
      button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (this.recipient_id !== 0) {
          this.parent.removeChatGroup(this.recipient_id);
          this.remove();
        }
      });
      button.addEventListener('click', (e) => {
        if (!this.isGlobal && window.innerWidth <= 600) {
          this.parent.removeChatGroup(this.recipient_id);
          this.remove();
        } else {
          if (!e.shiftKey) {
            this.toggleStyles(button);
          }
          this.renderAllMessage();
          this.setupSendButton();
          this.scrollToBottom();
          this.setupInput();
        }
      });
    }
  };

  setupSendButton = (): void => {
    if (!this.collapsed) {
      axios.patch('../friends/markAsRead.php', {
        user_id: this.recipient_id,
        recipient_id: this.localId,
      });

      const send = this.shadowRoot?.getElementById('sendChat') as HTMLElement;
      send.addEventListener('click', () => {
        this.sendMessage();
      });
    }
  };

  setupInput = (): void => {
    this.inputField = this.shadowRoot?.getElementById(
      'chatContent'
    ) as HTMLInputElement;
    if (this.inputField) {
      this.inputField.value = this.message;
      this.inputField.addEventListener('input', () => {
        if (this.inputField) {
          this.message = this.inputField.value;
        }
      });
    }
  };

  renderAllMessage = (): void => {
    const chatBox = this.shadowRoot?.getElementById(this.groupName + '-chat');
    if (this.collapsed && chatBox) {
      chatBox.innerHTML = '';
    } else if (chatBox) {
      chatBox.innerHTML = `
      <div class="chat-inner-container">
  
      <div id="sendBar">
        <textarea type="text" id="chatContent"></textarea>
        <button id="sendChat" part="base-button" class="base-button short">Send</button>
        </div>
        <div id="${this.groupName}-chat-inner" class="chat-group"></div>
      </div>
      `;

      this.chat.forEach((message) => {
        this.displayMessage(message);
      });
    }
  };

  render = (): void => {
    const status =
      !this.isGlobal && window.innerWidth <= 600 ? 'open' : 'closed';
    const html = `
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles/chatGroup.css">
    <div id="dragger"></div>
      <div id="${this.groupName}" class="chat-group-container-${status}">
        <div id="frame" class="chat-group-inner-${status}">
        <div id="${this.groupName}-chat">
        </div>
        <button id="open" class="chat-button-${status} ${status}">${
      status === 'open' ? '???' : this.groupName
    }</button>
        </div>
      </div>
      `;
    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
    if (status === 'open') {
      this.collapsed = false;
      this.renderAllMessage();
      this.setupSendButton();
      this.setupInput();
    }
  };

  dragStart = (e: MouseEvent): void => {
    const chatArea = this.shadowRoot?.getElementById(this.groupName);
    if (chatArea) {
      this.size = chatArea?.getBoundingClientRect();
    }
    if (e.shiftKey) {
      e.preventDefault();
      this.style.position = 'absolute';
      this.dragging = true;
    }
  };

  dragEnd = (): void => {
    this.dragging = false;
  };
}

customElements.define('x-chat-group', ChatGroup);
