import { addFriend } from '../api';
import { capitalise } from '../game/utils';
import { Friend } from '../menu/gameMenu';
import { FriendHandler } from '../socket/FriendHandler';
import { SiteSocket } from '../socket/MenuSocket';
import { ChatGroup } from './ChatGroup';
import { CollapsingComponent } from './CollapsingComponent';

export interface Friends {
  [key: number]: Friend;
}

export interface FriendStatus {
  online?: string;
  inGame?: string;
}

export class FriendList extends CollapsingComponent {
  collapsed: boolean = true;
  add: HTMLElement | null = null;

  constructor(public socket: SiteSocket, public friends: Friends) {
    super('Friends', 'top-right', () => {
      this.renderFriends();
      this.add = this.shadowRoot?.getElementById('addFriend') as HTMLElement;
      this.setupAddButton();
    });
    new FriendHandler(this);
    this.setContent();
  }

  setContent = (): void => {
    this.innerContent = `
    <link rel="stylesheet" href="../../styles/friendList.css">
    <div id="addBar">
      <input type="text" id="friendName"/>
      <button id="addFriend" class="base-button short">Add</button>
    </div>
      <div id="friends">${Object.values(this.friends)
        .map((friend) => this.getFriendRow(friend))
        .join('')}</div>
    `;
  };

  setupAddButton = (): void => {
    this.add?.addEventListener('click', () => {
      const nameInput = this.shadowRoot?.getElementById(
        'friendName'
      ) as HTMLInputElement;
      addFriend(nameInput.value).then((friend) => {
        this.friends[friend.id] = friend;
        this.socket.send(
          JSON.stringify({ type: 'status', id: friend.id, name: friend.name })
        );
      });
    });
  };

  renderFriends = () => {
    Object.values(this.friends).forEach((friend) => {
      const ele = this.shadowRoot?.getElementById(String(friend.id));
      ele?.addEventListener('click', () => {
        document.body.appendChild(
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

  updateFriendRow = (friendId: number, updates: FriendStatus): void => {
    Object.entries(updates).forEach((data: [string, string]) => {
      const [id, value] = data;
      const row = this.getById(`${friendId}${id}`);
      if (row) {
        row.innerText = value;
      }
    });
  };

  getFriendRow = (friend: Friend) => {
    return `<div class="friend-row" id="${friend.id}" value="${friend.id}">
      <p id="${friend.id}name" class="friend-block">${capitalise(
      friend.name
    )}</p>
      <p id="${friend.id}online" class="friend-block">${
      friend.online ? 'Online' : 'Offline'
    }</p>
      <p id="${friend.id}inGame" class="friend-block">${
      friend.inGame ? 'In Game' : 'Not playing'
    }</p>
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
