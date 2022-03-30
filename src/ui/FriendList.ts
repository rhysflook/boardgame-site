import axios, { AxiosResponse } from '../../node_modules/axios/index';
import { addFriend, getPlayerId, IFriendReq } from '../api';
import { capitalise } from '../game/utils';
import { Friend } from '../menu/gameMenu';

export class FriendList extends HTMLElement {
  collapsed: boolean = true;
  add: HTMLElement | null = null;
  constructor(public friends: Friend[], public socket: WebSocket) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    this.render();
    this.setupToggleButton();
  }

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
      getPlayerId(nameInput.value, true).then(() => {
        if (!this.alreadyFriends(res.data.id)) {
          addFriend(this.getFriendReq(res.data.id, nameInput.value)).then(
            () => {
              this.friends.push({
                id: res.data.id,
                name: nameInput.value,
                online: false,
                inGame: false,
              });
              this.renderFriends();
            }
          );
        }
      });
    });
  };

  alreadyFriends = (id: number): boolean => {
    const friends = JSON.parse(localStorage.getItem('friends') as string).map(
      (friend: Friend) => friend.id
    );
    return friends?.includes(id);
  };

  getFriendReq = (id: number, name: string): IFriendReq => {
    return {
      id: Number(localStorage.getItem('id')),
      name: localStorage.getItem('username') as string,
      friendId: id,
      friendName: name,
    };
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
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }
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
              .map(
                (friend) =>
                  `<div class="friend-row">
                    <p class="friend-block">${capitalise(friend.name)}</p>
                    <p class="friend-block">${
                      friend.online ? 'Online' : 'Offline'
                    }</p>
                    <p class="friend-block">${
                      friend.inGame ? 'In Game' : 'Not playing'
                    }</p>
                </div>
              `
              )
              .join('')}</div>
        `;
      }
    }
  };
}

customElements.define('x-friendlist', FriendList);
