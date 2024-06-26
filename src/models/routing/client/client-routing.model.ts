import { TFilter } from "@/app/(site)/app/collection/(page)/models";
import { Database } from "@/supabase/types";

export class ClientRouting {
  static get auth() {
    return {
      signUp: "/auth/sign-up",
      signIn: "/auth/log-in",
    };
  }

  static get home() {
    return "/";
  }

  static get app() {
    return "/app";
  }

  static get configuration() {
    return {
      home: "/app/settings",
      editProfile: "/app/settings/section/profile",
      resetPassword: "/app/settings/section/reset-password",
      accessibility: "/app/settings/section/accessibility",
      account: "/app/settings/section/account",
    };
  }

  static collection() {
    return {
      list: ({ filter = "default" }: { filter?: TFilter }) =>
        `/app/collection?filter=${filter}`,
      home: (
        collectionId: Database["public"]["Tables"]["collection"]["Row"]["id"],
      ) => `/app/collection/${collectionId}`,
      new: () => "/app/collection/new",
      edit: (
        collectionId: Database["public"]["Tables"]["collection"]["Row"]["id"],
      ) => `/app/collection/${collectionId}/edit`,
    };
  }

  static post() {
    return {
      newPost: "/app/post/new",
      page: (postId: number) => `/app/post/${postId}`,
      search: {
        page: "/app/search",
        searchByTitle: (title: string) => `app/search?search_query=${title}`,
      },
      edit: (postId: number) => `/app/post/${postId}/edit`,
    };
  }

  static profile(username: string) {
    return `/app/profile/${username}`;
  }
}
