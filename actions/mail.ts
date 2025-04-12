'use server';
import { Attachment, EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

import { admin } from '@/constants/admin';
import { randomUUID } from 'crypto';

type ContactType = {
  email: string;
  name: string;
};

type IcsType = {
  uid: string;
  summary: string;
  description: string;
  location: string;
  startTime: Date | string;
  endTime: Date | string;
};

function formatToICSDate(date: string | Date | number) {
  const newDate = new Date(date);
  const year = newDate.getUTCFullYear();
  const month = String(newDate.getUTCMonth()).padStart(2, '0');
  const day = String(newDate.getUTCDate()).padStart(2, '0');
  const hours = String(newDate.getUTCHours()).padStart(2, '0');
  const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(newDate.getUTCSeconds()).padStart(2, '0');
  const result = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  return result;
}

function generateICS({ uid, summary, description, location, startTime, endTime }: IcsType) {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourApp//ZoomIntegration//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uid}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
DTSTAMP:${formatToICSDate(new Date())}
DTSTART:${formatToICSDate(startTime)}
DTEND:${formatToICSDate(endTime)}
ORGANIZER;CN=${admin.name}:mailto:${admin.email}
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
}

export const sendMessageMail = async (to: ContactType, from: ContactType, message: string) => {
  const mailersend = new MailerSend({
    apiKey: process.env['NEXT_PUBLIC_MAILSENDER_API_TOKEN'] ?? '',
  });
  const author = new Sender('contact@alexandre-em.fr', 'Keita Yasue | Contact');
  const recipients = [new Recipient(to.email, to.name)];

  const personalization = [
    {
      email: to.email,
      data: {
        name: to.name,
        user: {
          name: from.name,
        },
        comment: {
          date: new Date().toLocaleDateString(),
        },
        account_name: 'Keita Yasue',
        message,
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(author)
    .setTo(recipients)
    .setReplyTo(new Recipient(from.email, from.name))
    .setSubject(`New message from ${to.name}`)
    .setTemplateId(process.env['NEXT_PUBLIC_MAILSENDER_MESSAGE_TEMPLATE_ID'] ?? '')
    .setPersonalization(personalization);

  await mailersend.email.send(emailParams);
};

type ReservationData = {
  date: string;
  time: string;
  jpTime: string;
};

export const sendReservationMail = async (to: ContactType, data: ReservationData) => {
  const mailersend = new MailerSend({
    apiKey: process.env['NEXT_PUBLIC_MAILSENDER_API_TOKEN'] ?? '',
  });
  const author = new Sender('contact@alexandre-em.fr', 'Keita Yasue | Contact');
  const recipients = [new Recipient(to.email, to.name)];

  const personalization = [
    {
      email: to.email,
      data: {
        name: to.name,
        date: data.date,
        time: data.time,
        jptime: data.jpTime,
        account_name: 'Keita Yasue',
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(author)
    .setTo(recipients)
    .setCc([new Recipient(admin.email, 'Keita Yasue')])
    .setReplyTo(new Recipient(admin.email, 'Keita Yasue'))
    .setSubject(`New reservation with Keita the ${data.date}`)
    .setTemplateId(process.env['NEXT_PUBLIC_MAILSENDER_RESERVATION_TEMPLATE_ID'] ?? '')
    .setPersonalization(personalization);

  await mailersend.email.send(emailParams);
};

type ValidationReservationData = {
  startDate: Date;
  endDate: Date;
  meetingLink: string;
};

export const sendValidationReservationMail = async (to: ContactType, data: ValidationReservationData) => {
  const mailersend = new MailerSend({
    apiKey: process.env['NEXT_PUBLIC_MAILSENDER_API_TOKEN'] ?? '',
  });
  const author = new Sender('contact@alexandre-em.fr', 'Keita Yasue | Contact');
  const recipients = [new Recipient(to.email, to.name)];
  const { startDate, endDate } = data;

  const dateLocale = startDate.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeLocale = `${startDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })} to ${endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })}`;
  const jpTime = `${startDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })} to ${endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })}`;

  const personalization = [
    {
      email: to.email,
      data: {
        name: to.name,
        date: dateLocale,
        time: timeLocale,
        jptime: jpTime,
        meetinglink: data.meetingLink,
        account_name: 'Keita Yasue',
      },
    },
  ];

  const content = generateICS({
    uid: randomUUID(),
    summary: 'Lesson with Keita the ' + dateLocale,
    description: 'Join Zoom Meeting: ' + data.meetingLink,
    location: data.meetingLink,
    startTime: startDate,
    endTime: endDate,
  });

  const attachmentContent = Buffer.from(content).toString('base64');

  const emailParams = new EmailParams()
    .setFrom(author)
    .setTo(recipients)
    .setCc([new Recipient(admin.email, 'Keita Yasue')])
    .setReplyTo(new Recipient(admin.email, 'Keita Yasue'))
    .setSubject(`Your lesson booking for the ${dateLocale} has been validated`)
    .setAttachments([new Attachment(attachmentContent, `invite-${to.name.trim()}-${formatToICSDate(startDate)}.ics`)])
    .setTemplateId(process.env['NEXT_PUBLIC_MAILSENDER_VALIDATION_RESERVATION_TEMPLATE_ID'] ?? '')
    .setPersonalization(personalization);

  await mailersend.email.send(emailParams);
};
