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
      home: "/app/collection",
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
