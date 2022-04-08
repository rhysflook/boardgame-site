import axios, { AxiosResponse } from '../node_modules/axios/index';
import { Friend, FriendShip } from './menu/gameMenu';
import { SiteSocket } from './socket/MenuSocket';

export interface IFriendReq {
  id: number;
  name: string;
  friendId: number;
  friendName: string;
}

export const savePlayerLocally = (id: number, name: string) => {
  localStorage.setItem('id', String(id));
  localStorage.setItem('username', String(name));
};

export const getPlayerId = (
  name: string | null = null,
  isLocal: boolean
): Promise<void> => {
  const promise = new Promise<void>((resolve) => {
    if (name) {
      axios
        .get(`../utils/getPlayer.php?user=${name}`)
        .then((res: AxiosResponse) => {
          if (isLocal) {
            savePlayerLocally(res.data.id, name);
          }
          resolve();
        });
    } else {
      resolve();
    }
  });
  return promise;
};

export const addFriend = async (name: string): Promise<Friend> => {
  const promise = new Promise<Friend>((resolve) => {
    axios.get(`../utils/getPlayer.php?user=${name}`).then((res) => {
      if (!alreadyFriends(res.data.id)) {
        const reqBody = getFriendReq(res.data.id, name);
        axios
          .post('../friends/addFriend.php', reqBody)
          .then((res: AxiosResponse) => {
            if (res) {
              const friends = JSON.parse(
                localStorage.getItem('friends') as string
              );
              friends[reqBody.friendId] = { id: reqBody.friendId, name };
              localStorage.setItem('friends', JSON.stringify(friends));
              resolve({
                id: reqBody.friendId,
                name,
                online: false,
                inGame: false,
              });
            }
          });
      }
    });
  });
  return promise;
};

const alreadyFriends = (id: number): boolean => {
  const friends = Object.values(
    JSON.parse(localStorage.getItem('friends') as string)
  ) as Friend[];

  friends.map((friend: Friend) => friend.id);
  return Object.keys(friends).includes(String(id));
};

const getFriendReq = (id: number, name: string): IFriendReq => {
  return {
    id: Number(localStorage.getItem('id')),
    name: localStorage.getItem('username') as string,
    friendId: id,
    friendName: name,
  };
};

export const getFriendList = (socket: SiteSocket) => {
  return axios.get(
    `../friends/getFriends.php?id=${Number(localStorage.getItem('id'))}`
  );
};

export const changeUserDetails = (newName: string, password: string) => {
  return axios.patch('../user/changeUser.php', {
    username: localStorage.getItem('username'),
    newName,
    password,
  });
};
