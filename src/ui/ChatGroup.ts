import { Message } from '../chatbox/Message';
import { SiteSocket } from '../socket/MenuSocket';

export class ChatGroup extends HTMLElement {
  collapsed: boolean = true;
  chat: Message[] = [];
  localId: number;
  constructor(
    public socket: SiteSocket,
    public localUser: string,
    public groupName: string,
    public isGlobal: boolean = true
  ) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.localId = Number(localStorage.getItem('id'));
    this.render();
    this.handleIncomingMessage();
    this.toggleChar();
  }

  handleIncomingMessage = () => {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chatMessage') {
        const message = new Message(
          data.content,
          data.sender,
          data.sender === this.localUser
        );
        this.chat.push(message);
        const chatBox = this.shadowRoot?.getElementById(
          this.groupName + '-chat'
        );
        chatBox?.appendChild(message.renderMessage());
      }
    });
  };

  sendMessage = (): void => {
    const chatInput = this.shadowRoot?.getElementById(
      'chatContent'
    ) as HTMLInputElement;
    this.socket.send(
      JSON.stringify({
        type: 'chatMessage',
        content: chatInput.value,
        sender: this.localUser,
        id: this.localId,
      })
    );

    // const chatBox = this.shadowRoot?.getElementById(this.groupName + '-chat');
    // const message = new Message(chatInput.value, this.localUser, true);
    // this.chat.push(message);
    // chatBox?.appendChild(message.renderMessage());
  };

  toggleChar = (): void => {
    const button = this.shadowRoot?.getElementById('open');
    if (button) {
      button.addEventListener('click', () => {
        this.collapsed = !this.collapsed;
        this.renderAllMessage();
        if (!this.collapsed) {
          const send = this.shadowRoot?.getElementById(
            'sendChat'
          ) as HTMLElement;
          send.addEventListener('click', () => {
            this.sendMessage();
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
      <div id="sendBar">
        <input type="text" id="chatContent"/>
        <button id="sendChat" class="popup-button short">Send</button>
      </div>
      `;
      this.chat.forEach((message) => {
        console.log('yo');
        chatBox?.appendChild(message);
      });
    }
  };

  render = (): void => {
    const html = `
    <link rel="stylesheet" href="../../menu.css">
      <div id="${this.groupName}">
        <button id="open" class="popup-button short corner">${this.groupName}</button>
        <div id="${this.groupName}-chat">
        </div>
      </div>
      `;
    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
    console.log('yo');
  };
}

customElements.define('x-chat-group', ChatGroup);
