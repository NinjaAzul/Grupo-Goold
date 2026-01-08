export interface IRoom {
  id: number;
  name: string;
  startTime: string; // Formato HH:mm (ex: "08:00")
  endTime: string; // Formato HH:mm (ex: "18:00")
  timeBlock: number; // Bloco de horários em minutos (ex: 30)
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
