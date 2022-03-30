import { SiteSocket } from '../socket/MenuSocket';
import { ChatGroup } from './ChatGroup';

export class ChatArea extends HTMLElement {
  constructor(public socket: SiteSocket) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  render = (): void => {
    const html = `
    <link rel="stylesheet" href="../../menu.css">
    <div id="chatArea">
    </div>
    `;
    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
    const chat = this.shadowRoot?.getElementById('chatArea');
    const user = localStorage.getItem('username') as string;
    const globalChat = new ChatGroup(this.socket, user, 'global', 0);
    chat?.appendChild(globalChat);
  };
}

customElements.define('x-chat-area', ChatArea);
