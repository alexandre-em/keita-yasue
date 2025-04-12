import { admin } from '@/constants/admin';
import { NextRequest } from 'next/server';

const ZOOM_CLIENT_ID = process.env['ZOOM_CLIENT_ID'] ?? '';
const ZOOM_CLIENT_SECRET = process.env['ZOOM_CLIENT_SECRET'] ?? '';
const ZOOM_ACCOUNT_ID = process.env['ZOOM_ACCOUNT_ID'] ?? '';

async function getAccessToken() {
  const response = await fetch(`https://zoom.us/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: ZOOM_ACCOUNT_ID,
    }),
  });
  return await response.json();
}

type CreateRoomBody = {
  start: string;
  email: string;
};

export async function POST(request: NextRequest) {
  const { access_token } = await getAccessToken();
  const body = (await request.json()) satisfies CreateRoomBody;

  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    body: JSON.stringify({
      default_password: false,
      duration: 60,
      contact_email: 'alexandre.em.em@gmail.com',
      contact_name: 'Alexandre Em',
      schedule_for: 'kildus94@gmail.com',
      topic: 'Lesson with Keita Yasue',
      type: 2,
      start_time: body.start,
      timezone: 'UTC',
      settings: {
        join_before_host: true,
        email_notification: true,
        waiting_room: false,
        meeting_invitees: [{ email: admin.email }, { email: body.email }],
        host_video: true,
        participant_video: true,
        registrants_confirmation_email: true,
        registrants_email_notification: true,
        push_change_to_calendar: true,
      },
    }),
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  return Response.json(json);
}
