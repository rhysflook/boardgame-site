import axios, { AxiosResponse } from '../node_modules/axios/index';

export interface IFriendReq {
  id: number;
  name: string;
  friendId: number;
  friendName: string;
}

export const getPlayerId = (name: string | null = null) => {
  return axios.get(
    `../game/getPlayer.php?user=${name || localStorage.getItem('username')}`
  );
};

export const addFriend = async (friendReq: IFriendReq) => {
  return axios
    .post('../ui/addFriend.php', friendReq)
    .then((res: AxiosResponse) => {
      if (res) {
        const friends = JSON.parse(localStorage.getItem('friends') as string);
        friends.push({ id: res.data.id, name: friendReq.friendName });
        localStorage.setItem('friends', JSON.stringify(friends));
      }
    });
};
