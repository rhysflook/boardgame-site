import { addFriend, getFriendList } from '../api';
import { capitalise } from '../game/utils';
import { Friend } from '../menu/gameMenu';
import { SiteSocket } from '../socket/MenuSocket';
import { INewFriend } from '../socket/MessageHandler';
import { ChatGroup } from './ChatGroup';

export class FriendList extends HTMLElement {
  collapsed: boolean = true;
  add: HTMLElement | null = null;
  friends: Friend[] = [];

  constructor(public socket: SiteSocket) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    getFriendList()
      .then(() => {
        this.friends = JSON.parse(localStorage.getItem('friends') as string);
        this.render();
        this.setupToggleButton();
        this.listenForChanges();
      })
      .catch(() => {
        localStorage.setItem('friends', JSON.stringify([]));
        this.render();
        this.setupToggleButton();
        this.listenForChanges();
      });
  }

  listenForChanges = () => {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data) as INewFriend;
      if (data.type === 'newFriend') {
        const { id, name, online, in_game } = data;
        this.createRow({ id, name, online, inGame: in_game });
      }
    });
  };

  setupToggleButton = (): void => {
    const button = this.shadowRoot?.getElementById('friend-button');
    if (button) {
      button.addEventListener('click', () => {
        this.collapsed = !this.collapsed;
        this.renderFriends();
        if (!this.collapsed) {
          this.add = this.shadowRoot?.getElementById(
            'addFriend'
          ) as HTMLElement;
          this.setupAddButton();
        }
      });
    }
  };

  setupAddButton = (): void => {
    this.add?.addEventListener('click', () => {
      const nameInput = this.shadowRoot?.getElementById(
        'friendName'
      ) as HTMLInputElement;
      addFriend(nameInput.value).then((friend) => {
        this.friends.push(friend);
        this.socket.getFriendStatus(friend.id, friend.name);
      });
    });
  };

  render = (): void => {
    const html = `
    <link rel="stylesheet" href="../../menu.css">
    <div id="friend-box">
        <button id="friend-button" class="popup-button short corner">Friends</button>
        <div id="friend-box-inner">
        </div>
    </div>
      `;
    const tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
  };

  renderFriends = () => {
    if (this.shadowRoot) {
      const inner = this.shadowRoot.getElementById('friend-box-inner');
      if (inner) {
        inner.innerHTML = this.collapsed
          ? ''
          : `
          <div id="addBar">
            <input type="text" id="friendName"/>
            <button id="addFriend" class="popup-button short">Add</button>
          </div>
            <div id="friends">${this.friends
              .map((friend) => this.getFriendRow(friend))
              .join('')}</div>
        `;
      }
    }
    this.friends.forEach((friend) => {
      const ele = this.shadowRoot?.getElementById(String(friend.id));
      ele?.addEventListener('click', () => {
        const chatArea = document.getElementById('chat-area-bar');
        chatArea?.appendChild(
          new ChatGroup(
            this.socket,
            localStorage.getItem('username') as string,
            friend.name,
            friend.id,
            false
          )
        );
      });
    });
  };

  getFriendRow = (friend: Friend) => {
    return `<div class="friend-row" id="${friend.id}" value="${friend.id}">
      <p class="friend-block">${capitalise(friend.name)}</p>
      <p class="friend-block">${friend.online ? 'Online' : 'Offline'}</p>
      <p class="friend-block">${friend.inGame ? 'In Game' : 'Not playing'}</p>
      </div>
    `;
  };

  createRow = (friend: Friend) => {
    const friends = this.shadowRoot?.getElementById('friends');
    const tmpl = document.createElement('template');
    tmpl.innerHTML = this.getFriendRow(friend);
    friends?.appendChild(tmpl.content.cloneNode(true));
  };
}

customElements.define('x-friendlist', FriendList);
