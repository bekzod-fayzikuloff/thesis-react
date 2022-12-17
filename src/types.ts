export interface IUserProfile {
  id: number;
  username: string;
  followersCount: number;
  followedToCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  description: string;
  isPrivate: boolean;
}

export interface IFollower {
  id: number;
  follower: {
    id: number;
    avatar: null | string;
    username: string;
  };
}

export type Media = {
  id: number;
  createdAt: string;
  updatedAt: string;
  file: string;
};

export interface IPost {
  id: number;
  medias: Media[];
}
