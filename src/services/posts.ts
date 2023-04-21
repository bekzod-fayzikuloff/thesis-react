import axios from 'axios';
import { API_URL } from '../config';

export async function createComment(postId: number | undefined, text: string) {
  return await axios.post(
    `${API_URL}/api/comments/`,
    {
      post: postId,
      content: text
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken') as string).access}`
      }
    }
  );
}
