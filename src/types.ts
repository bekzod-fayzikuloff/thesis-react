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
  likes: number;
  comments: number;
  description: string;
  creatorUsername: string;
  medias: Media[];
  creatorId: number;
  creatorAvatar: string | null;
  postIsSaved: boolean;
  postIsLiked: boolean;
}

export interface IFeedPost {
  id: number;
  createdAt: string;
  creatorUsername: string;
  creatorAvatar: string | null;
  creatorId: number;
  description: string;
  isActive?: boolean;
  medias: Media[];
  updatedAt: string;
  likes: number;
  commentsQuantity: number;
  postIsLiked: boolean;
  postIsSaved: boolean;
  postIsSavedGroups: number[];
  postLikeId: number | null;
  postSavedGroupId: number;
}

export interface IPostGroup {
  creator: number;
  id: number;
  postsThumbnail: {
    id: number;
    medias: Media[];
  };
  title: string;
}

export interface IPostGroupDetail {
  id: number;
  posts: {
    id: number;
    comments: number;
    likes: number;
    medias: Media[];
  }[];
  title: string;
}

export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  avatar: string | null;
  username: number;
  creatorId: number;
  updatedAt: string;
}
