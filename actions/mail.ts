'use server';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

import { admin } from '@/constants/admin';

type ContactType = {
  email: string;
  name: string;
};

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
