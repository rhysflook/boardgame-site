import axios, { AxiosResponse } from '../node_modules/axios/index';
import { Friend, FriendShip } from './menu/gameMenu';

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
        .get(`../game/getPlayer.php?user=${name}`)
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
    axios.get(`../game/getPlayer.php?user=${name}`).then((res) => {
      if (!alreadyFriends(res.data.id)) {
        const reqBody = getFriendReq(res.data.id, name);
        axios
          .post('../ui/addFriend.php', reqBody)
          .then((res: AxiosResponse) => {
            if (res) {
              const friends = JSON.parse(
                localStorage.getItem('friends') as string
              );
              friends.push({ id: reqBody.friendId, name });
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
  const friends = JSON.parse(localStorage.getItem('friends') as string).map(
    (friend: Friend) => friend.id
  );
  return friends?.includes(id);
};

const getFriendReq = (id: number, name: string): IFriendReq => {
  return {
    id: Number(localStorage.getItem('id')),
    name: localStorage.getItem('username') as string,
    friendId: id,
    friendName: name,
  };
};

export const getFriendList = () => {
  return axios
    .get(`../ui/getFriends.php?id=${Number(localStorage.getItem('id'))}`)
    .then((res: AxiosResponse) => {
      const friends = [] as Friend[];
      const userId = Number(localStorage.getItem('id'));
      res.data.forEach((friendship: FriendShip) => {
        friends.push(
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
              }
        );
      });
      localStorage.setItem('friends', JSON.stringify(friends));
    });
};
