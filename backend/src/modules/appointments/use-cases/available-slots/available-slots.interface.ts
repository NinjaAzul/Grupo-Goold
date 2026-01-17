export interface IAvailableSlotsRequest {
  date: string;
  roomId?: number;
}

export interface IAvailableSlotsResponse {
  slots: string[];
}
