export interface IAvailableSlotsRequest {
  date: string; // YYYY-MM-DD
  roomId?: number;
}

export interface IAvailableSlotsResponse {
  slots: string[]; // Array de horários no formato HH:mm
}

