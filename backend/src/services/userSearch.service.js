import * as userSearchRepo from "../repositories/userSearch.repository.js";
export const searchUsers = async (requesterId, query) => {
  if (query.length < 2) {
    return [];
  }
  return userSearchRepo.searchUsers(query, requesterId);
};