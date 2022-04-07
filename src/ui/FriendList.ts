import { AxiosResponse } from '../../node_modules/axios/index';
import { addFriend, getFriendList } from '../api';
import { capitalise } from '../game/utils';
import { Friend, FriendShip } from '../menu/gameMenu';
import { SiteSocket } from '../socket/MenuSocket';
import { INewFriend } from '../socket/MessageHandler';
import { ChatGroup } from './ChatGroup';
import { CollapsingComponent } from './CollapsingComponent';

export class FriendList extends CollapsingComponent {
  collapsed: boolean = true;
  add: HTMLElement | null = null;
  friends: { [key: number]: Friend } = {};

  constructor(public socket: SiteSocket) {
    super('Friends', 'top-right', () => {
      this.renderFriends;
      this.add = this.shadowRoot?.getElementById('addFriend') as HTMLElement;
      this.setupAddButton();
    });

    getFriendList(this.socket)
      .then((res: AxiosResponse) => {
        const userId = Number(localStorage.getItem('id'));
        res.data.forEach((friendship: FriendShip) => {
          this.friends[
            friendship[0] === userId ? friendship[1] : friendship[0]
          ] =
            friendship[0] === userId
              ? {
                  id: friendship[1],
                  name: friendship[3],
                  online: false,
                  inGame: false,
                }
              : {
                  id: friendship[0],
                  name: friendship[2],
                  online: false,
                  inGame: false,
                };
        });
        this.listenForChanges();
        console.log('WHERE MY FRIENDS AT?');
        const ids = Object.keys(this.friends).map((friend) => Number(friend));
        socket.send(
          JSON.stringify({
            type: 'get_friends',
            id: userId,
            ids: ids,
          })
        );
        console.log(this.friends);
        localStorage.setItem('friends', JSON.stringify(this.friends));
        this.friends = JSON.parse(localStorage.getItem('friends') as string);

        this.setContent();
      })
      .catch(() => {
        // localStorage.setItem('friends', JSON.stringify([]));
      });
  }

  setContent = (): void => {
    this.innerContent = `
    <div id="addBar">
      <input type="text" id="friendName"/>
      <button id="addFriend" class="popup-button short">Add</button>
    </div>
      <div id="friends">${Object.values(this.friends)
        .map((friend) => this.getFriendRow(friend))
        .join('')}</div>
    `;
  };

  listenForChanges = () => {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newFriend') {
        const { id, name, online, in_game } = data;
        this.createRow({ id, name, online, inGame: in_game });
      } else if (data.type === 'players') {
        Object.values(data.players).forEach((player: any) => {
          this.friends[player.id].inGame = player.in_game;
          this.friends[player.id].online = true;
          console.log(this.friends);
        });
        this.setContent();
      }
    });
  };

  setupAddButton = (): void => {
    this.add?.addEventListener('click', () => {
      const nameInput = this.shadowRoot?.getElementById(
        'friendName'
      ) as HTMLInputElement;
      addFriend(nameInput.value).then((friend) => {
        this.friends[friend.id] = friend;
        this.socket.getFriendStatus(friend.id, friend.name);
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
