import axios from '../../node_modules/axios/index';
import { Message } from '../chatbox/Message';
import { capitalise } from '../game/utils';
import { SiteSocket } from '../socket/MenuSocket';

export class ChatGroup extends HTMLElement {
  collapsed: boolean = true;
  chat: HTMLElement[] = [];
  localId: number;
  inputField: HTMLInputElement | null = null;
  message: string = '';
  constructor(
    public socket: SiteSocket,
    public localUser: string,
    public groupName: string,
    public recipient_id: number,
    public isGlobal: boolean = true,
    public setUnread: boolean = false
  ) {
    super();
    this.id = this.groupName;
    this.style.width = '100px';
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.localId = Number(localStorage.getItem('id'));
    this.getChatHistory().then((res) => {
      res.data.forEach((message: any[]) => {
        this.storeAndDisplayMessage(message[1], message[2], false);
      });
      this.render();
      this.handleIncomingMessage();
      this.toggleChar();
      this.shadowRoot
        ?.getElementById('close')
        ?.addEventListener('click', () => this.remove());
      this.setUnread && this.setGroupUnread();
    });
  }

  setGroupUnread = (): void => {
    const button = this.shadowRoot?.getElementById('open');
    if (button) {
      button.classList.add('unread');
    }
  };

  getChatHistory = () => {
    if (this.isGlobal) {
      return axios.get(
        `../ui/getChatHistory.php?recipient_id=${this.recipient_id}}`
      );
    } else {
      return axios.get(
        `../ui/getSpecificChatHistory.php?recipient_id=${this.recipient_id}}&user_id=${this.localId}`
      );
    }
  };

  saveChatMessage = (id: number, sender: string, message: string) => {
    return axios.post('../ui/saveChat.php', {
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
    const message = new Message(
      content,
      capitalise(sender),
      sender === this.localUser
    );
    this.chat.push(message.renderMessage());
    show && this.displayMessage(message);
  };

  displayMessage = (message: HTMLElement): void => {
    if (!this.collapsed) {
      const chatBox = this.shadowRoot?.getElementById(
        this.groupName + '-chat-inner'
      );
      if (chatBox) {
        chatBox.appendChild(message);
        this.scrollToBottom(chatBox);
      }
    }
  };

  scrollToBottom = (chat: HTMLElement): void => {
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
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
        chatInput.value = '';
      }
    );
  };

  toggleChar = (): void => {
    const button = this.shadowRoot?.getElementById('open');
    if (button) {
      button.addEventListener('click', () => {
        const frame = this.shadowRoot?.getElementById('frame') as HTMLElement;
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
          this.inputField = null;
          button.className = 'popup-button closed';
          frame.className = 'chat-group-inner-closed';
        } else {
          button.className = 'popup-button short open';
          frame.className = 'chat-group-inner-open';
        }
        this.renderAllMessage();
        if (!this.collapsed) {
          axios.patch('../ui/markAsRead.php', {
            user_id: this.recipient_id,
            recipient_id: this.localId,
          });

          const send = this.shadowRoot?.getElementById(
            'sendChat'
          ) as HTMLElement;
          send.addEventListener('click', () => {
            this.sendMessage();
          });
        }
        const chat = this.shadowRoot?.getElementById(
          `${this.groupName}-chat-inner`
        );
        if (chat) {
          chat.scrollTop = chat.scrollHeight - chat.clientHeight;
        }
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
        <button id="sendChat" class="popup-button short">Send</button>
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
    const html = `
    <link rel="stylesheet" href="../../menu.css">
      <div id="${this.groupName}" class="chat-group-container">
        <div id="frame" class="chat-group-inner-closed">
        <div id="${this.groupName}-chat">
        </div>
        <button id="open" class="popup-button closed">${
          this.groupName
        }</button>${this.isGlobal ? '' : `<button id="close">✕</button>`}
        </div>
      </div>
      `;
    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
  };
}

customElements.define('x-chat-group', ChatGroup);