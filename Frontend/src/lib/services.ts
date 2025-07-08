import { apiClient } from "./api";

export async function signup(userData: {
  name: string;
  email: string;
  dateOfBirth: string;
}) {
  return apiClient.signup(userData);
}

export async function verifySignup(userData: {
  name: string;
  email: string;
  dateOfBirth: string;
  otp: string;
}) {
  return apiClient.verifySignup(userData);
}

export async function requestSigninOTP(email: string) {
  return apiClient.requestSigninOTP(email);
}

export async function signin(credentials: {
  email: string;
  otp: string;
  keepLoggedIn?: boolean;
}) {
  return apiClient.signin(credentials);
}

export async function logout() {
  return apiClient.logout();
}

export async function getUserProfile() {
  return apiClient.getUserProfile();
}

export async function updateUserProfile(userData: {
  name?: string;
  dateOfBirth?: string;
}) {
  return apiClient.updateUserProfile(userData);
}

export async function getNotes(page = 1, limit = 50) {
  return apiClient.getNotes(page, limit);
}

export async function createNote(text: string) {
  return apiClient.createNote(text);
}

export async function updateNote(id: string, text: string) {
  return apiClient.updateNote(id, text);
}

export async function deleteNote(id: string) {
  return apiClient.deleteNote(id);
}
