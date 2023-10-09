export const API_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  getPersonalMessages: "/messages",
  createMessage: "/messages/create",
  deleteMessage: (id: string) => "/messages/" + id,
};
