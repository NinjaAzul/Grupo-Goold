"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const date_fns_1 = require("date-fns");
/**
 * Helper para trabalhar com datas em UTC/ISO
 * Garante consistência em todo o sistema
 */
class DateHelper {
    /**
     * Formata uma data ISO (UTC) para o formato brasileiro
     * @param isoDate - Data em formato ISO string (UTC)
     * @returns String formatada: "dd/MM/yyyy às HH:mm"
     */
    static formatAppointmentDate(isoDate) {
        const date = typeof isoDate === 'string' ? (0, date_fns_1.parseISO)(isoDate) : isoDate;
        // Extrair componentes UTC para manter o horário correto
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    }
    /**
     * Cria uma data UTC a partir de componentes de data e hora
     * @param year - Ano
     * @param month - Mês (1-12)
     * @param day - Dia
     * @param hours - Hora (0-23)
     * @param minutes - Minutos (0-59)
     * @returns Date object em UTC
     */
    static createUTCDate(year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
        return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds));
    }
    /**
     * Cria uma data UTC a partir de uma string de data (YYYY-MM-DD) e hora (HH:mm)
     * @param dateString - Data no formato YYYY-MM-DD
     * @param timeString - Hora no formato HH:mm
     * @returns Date object em UTC
     */
    static createUTCFromDateAndTime(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes] = timeString.split(':').map(Number);
        return this.createUTCDate(year, month, day, hours, minutes);
    }
    /**
     * Obtém o início do dia em UTC
     * @param dateString - Data no formato YYYY-MM-DD
     * @returns Date object representando 00:00:00 UTC do dia
     */
    static getStartOfDayUTC(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return this.createUTCDate(year, month, day, 0, 0, 0, 0);
    }
    /**
     * Obtém o fim do dia em UTC
     * @param dateString - Data no formato YYYY-MM-DD
     * @returns Date object representando 23:59:59.999 UTC do dia
     */
    static getEndOfDayUTC(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return this.createUTCDate(year, month, day, 23, 59, 59, 999);
    }
    /**
     * Adiciona minutos a uma data UTC
     * @param date - Data em UTC
     * @param minutes - Minutos a adicionar
     * @returns Nova Date object em UTC
     */
    static addMinutesUTC(date, minutes) {
        const newDate = new Date(date);
        newDate.setUTCMinutes(newDate.getUTCMinutes() + minutes);
        return newDate;
    }
    /**
     * Adiciona horas a uma data UTC
     * @param date - Data em UTC
     * @param hours - Horas a adicionar
     * @returns Nova Date object em UTC
     */
    static addHoursUTC(date, hours) {
        const newDate = new Date(date);
        newDate.setUTCHours(newDate.getUTCHours() + hours);
        return newDate;
    }
    /**
     * Formata uma data UTC para ISO string
     * @param date - Date object
     * @returns String ISO (UTC)
     */
    static toISOString(date) {
        return date.toISOString();
    }
    /**
     * Converte uma string ISO para Date object
     * @param isoString - String ISO
     * @returns Date object
     */
    static fromISOString(isoString) {
        return (0, date_fns_1.parseISO)(isoString);
    }
    /**
     * Extrai apenas a data (sem hora) de uma data ISO
     * @param isoDate - Data em formato ISO string (UTC)
     * @returns String no formato YYYY-MM-DD
     */
    static extractDateOnly(isoDate) {
        const date = typeof isoDate === 'string' ? (0, date_fns_1.parseISO)(isoDate) : isoDate;
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * Extrai apenas a hora (sem data) de uma data ISO
     * @param isoDate - Data em formato ISO string (UTC)
     * @returns String no formato HH:mm
     */
    static extractTimeOnly(isoDate) {
        const date = typeof isoDate === 'string' ? (0, date_fns_1.parseISO)(isoDate) : isoDate;
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=date.helper.js.map