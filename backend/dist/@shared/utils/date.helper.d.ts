/**
 * Helper para trabalhar com datas em UTC/ISO
 * Garante consistência em todo o sistema
 */
export declare class DateHelper {
    /**
     * Formata uma data ISO (UTC) para o formato brasileiro
     * @param isoDate - Data em formato ISO string (UTC)
     * @returns String formatada: "dd/MM/yyyy às HH:mm"
     */
    static formatAppointmentDate(isoDate: string | Date): string;
    /**
     * Cria uma data UTC a partir de componentes de data e hora
     * @param year - Ano
     * @param month - Mês (1-12)
     * @param day - Dia
     * @param hours - Hora (0-23)
     * @param minutes - Minutos (0-59)
     * @returns Date object em UTC
     */
    static createUTCDate(year: number, month: number, day: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date;
    /**
     * Cria uma data UTC a partir de uma string de data (YYYY-MM-DD) e hora (HH:mm)
     * @param dateString - Data no formato YYYY-MM-DD
     * @param timeString - Hora no formato HH:mm
     * @returns Date object em UTC
     */
    static createUTCFromDateAndTime(dateString: string, timeString: string): Date;
    /**
     * Obtém o início do dia em UTC
     * @param dateString - Data no formato YYYY-MM-DD
     * @returns Date object representando 00:00:00 UTC do dia
     */
    static getStartOfDayUTC(dateString: string): Date;
    /**
     * Obtém o fim do dia em UTC
     * @param dateString - Data no formato YYYY-MM-DD
     * @returns Date object representando 23:59:59.999 UTC do dia
     */
    static getEndOfDayUTC(dateString: string): Date;
    /**
     * Adiciona minutos a uma data UTC
     * @param date - Data em UTC
     * @param minutes - Minutos a adicionar
     * @returns Nova Date object em UTC
     */
    static addMinutesUTC(date: Date, minutes: number): Date;
    /**
     * Adiciona horas a uma data UTC
     * @param date - Data em UTC
     * @param hours - Horas a adicionar
     * @returns Nova Date object em UTC
     */
    static addHoursUTC(date: Date, hours: number): Date;
    /**
     * Formata uma data UTC para ISO string
     * @param date - Date object
     * @returns String ISO (UTC)
     */
    static toISOString(date: Date): string;
    /**
     * Converte uma string ISO para Date object
     * @param isoString - String ISO
     * @returns Date object
     */
    static fromISOString(isoString: string): Date;
    /**
     * Extrai apenas a data (sem hora) de uma data ISO
     * @param isoDate - Data em formato ISO string (UTC)
     * @returns String no formato YYYY-MM-DD
     */
    static extractDateOnly(isoDate: string | Date): string;
    /**
     * Extrai apenas a hora (sem data) de uma data ISO
     * @param isoDate - Data em formato ISO string (UTC)
     * @returns String no formato HH:mm
     */
    static extractTimeOnly(isoDate: string | Date): string;
}
//# sourceMappingURL=date.helper.d.ts.map