export type User = { id: string; email: string; name?: string; provider: "email"|"google" };

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}
export function loadUser(): User | null {
  const s = localStorage.getItem("user");
  return s ? JSON.parse(s) as User : null;
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.href = "/";
}
