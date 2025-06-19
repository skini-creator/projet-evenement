export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  confirmed: boolean;
  eventId: number;
  createdAt: Date;
}

export interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  maxGuests: number;
  description: string;
  createdAt: Date;
}
