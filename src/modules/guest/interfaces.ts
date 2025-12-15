export interface GuestCreateRequest {
  ipAddress?: string;
}

export interface GuestResponse {
  id: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}