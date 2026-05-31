import { Notification } from '../../domain/entities/notification';
import { NotificationSender } from '../../application/ports/notification-sender';

export class ConsoleNotificationSender implements NotificationSender {
  async send(notification: Notification): Promise<string | undefined> {
    const innerWidth = 56;
    const line = '─'.repeat(innerWidth);

    const writeLine = (left: string, right: string, rightPad: number): string => {
      const full = `${left}${right}`;
      if (full.length <= innerWidth) return `│${full.padEnd(innerWidth)}│`;
      const avail = innerWidth - left.length;
      const wsAt = right.lastIndexOf(' ', avail);
      const splitAt = wsAt > 0 ? wsAt : avail;
      const first = right.slice(0, splitAt);
      const rest = right.slice(splitAt).trimStart();
      const out = [`│${left}${first.padEnd(innerWidth - left.length)}│`];
      let remaining = rest;
      while (remaining.length > 0) {
        const cut = remaining.length > rightPad ? remaining.lastIndexOf(' ', rightPad) : -1;
        const splitAt = cut > 0 ? cut : rightPad;
        const chunk = remaining.slice(0, splitAt);
        out.push(`│${' '.repeat(left.length)}${chunk.padEnd(innerWidth - left.length)}│`);
        remaining = remaining.slice(splitAt).trimStart();
      }
      return out.join('\n');
    };

    const lines = [
      `┌${line}┐`,
      `│  ${'NOTIFICACIÓN DE RECOMPENSA'.padEnd(innerWidth - 2)}│`,
      `├${line}┤`,
      writeLine('  Tarjeta:           ', notification.cardNumber, 35),
      writeLine('  Email:             ', notification.email, 35),
      writeLine('  Cena:              ', notification.dinnerId, 35),
      writeLine('  Mensaje:           ', notification.message, 35),
      writeLine('  Enviado:           ', notification.sentAt.toISOString(), 35),
      `└${line}┘`,
    ];

    for (const l of lines) {
      for (const sub of l.split('\n')) {
        console.log(sub);
      }
    }
    return undefined;
  }
}
