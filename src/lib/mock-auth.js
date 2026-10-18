const KEY = "agriterra_admin";

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function login() {
  window.localStorage.setItem(KEY, "1");
}

export function logout() {
  window.localStorage.removeItem(KEY);
}
