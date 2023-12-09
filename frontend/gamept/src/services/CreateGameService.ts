import axios from 'axios';

const api = import.meta.env.VITE_SERVER_URL;

export const fetchGetStories = async () => {
  // 스토리 목록 받아오는 get 요청
  const url = api + '/game/story';
  // console.log('ㅁㄴㅇㄻㄴㅇㄻ', url);
  try {
    const response = await axios.get(url);
    // console.log(response);
    return response.data;
  } catch (err) {
    // throw err;
    console.log(err, '스토리 요청 실패');
  }
};

export const fetchPostGame = async (storyCode: string) => {
  // 게임 생성하는 post 요청
  const url = api + '/game';
  try {
    const response = await axios.post(url, { storyCode });
    return response.data;
  } catch (err) {
    console.log(err, '방 생성 실패');
  }
};
