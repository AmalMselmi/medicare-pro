export interface User {
  id?: string;
  nom: string;
  email: string;
  role: 'secretaire' | 'medecin' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}