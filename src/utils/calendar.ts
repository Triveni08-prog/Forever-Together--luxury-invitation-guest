import { WeddingEvent } from '../types/wedding';

/**
 * Generates an iCalendar (.ics) file string and triggers download
 */
export function downloadEventIcs(event: WeddingEvent, coupleNames: string) {
  // Parse date and time into iCal format (YYYYMMDDTHHmmss)
  // Example date: "2026-12-16", time: "10:00 AM"
  const parseDateTime = (dateStr: string, timeStr: string): string => {
    try {
      const [year, month, day] = dateStr.split('-');
      let hours = 10;
      let minutes = 0;

      const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const meridiem = timeMatch[3]?.toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }

      const pad = (n: number) => String(n).padStart(2, '0');
      return `${year}${pad(Number(month))}${pad(Number(day))}T${pad(hours)}${pad(minutes)}00`;
    } catch {
      return '20261218T100000';
    }
  };

  const startFormatted = parseDateTime(event.date, event.startTime);
  const endFormatted = parseDateTime(event.date, event.endTime);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const cleanText = (str: string) => str.replace(/\n/g, '\\n').replace(/,/g, '\\,');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forever Together//Luxury Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${event.id}-${Date.now()}@forevertogether.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${cleanText(`${event.name} - ${coupleNames} Wedding`)}`,
    `DESCRIPTION:${cleanText(`${event.description}\\n\\nDress Code: ${event.dressCode}`)}`,
    `LOCATION:${cleanText(`${event.venue}, ${event.address}`)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates WhatsApp share URL for a specific event
 */
export function getWhatsAppShareUrl(event: WeddingEvent, coupleNames: string): string {
  const message = `✨ You are warmly invited to ${event.name} for ${coupleNames}'s Wedding Celebrations!%0A%0A📅 Date: ${event.date}%0A⏰ Time: ${event.startTime} - ${event.endTime}%0A📍 Venue: ${event.venue}, ${event.address}%0A👗 Dress Code: ${event.dressCode}%0A%0AJoin us in celebration: ${window.location.origin}`;
  return `https://api.whatsapp.com/send?text=${message}`;
}
