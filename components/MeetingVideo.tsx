'use client';
import React, { useEffect, useState } from 'react';

import { JaaSMeeting } from '@jitsi/react-sdk';
import { isAfter, isBefore } from 'date-fns';
import { admin } from '@/constants/admin';
import { generate } from '@/actions/jitsy';

type MeetingVideoProps = {
  user: UserType;
  reservation: Omit<ReservationType, 'update'>;
};

export default function MeetingVideo(props: MeetingVideoProps) {
  const now = new Date();
  const { reservation, user } = props;
  const [jwt, setJwt] = useState<string>();
  const appId = process.env['NEXT_PUBLIC_JITSI_APP_ID'] || '';
  const pk = process.env['NEXT_PUBLIC_JITSI_PUBLIC_KEY'] || '';

  useEffect(() => {
    if (user) {
      generate({
        id: user.id,
        email: user.email,
        name: user.name,
        appId,
        kid: `${appId}${pk}` || '',
        avatar: user.image || '',
        role: user.role,
      }).then((res) => {
        setJwt(res);
      });
    }
  }, [user, reservation.id, appId, pk]);
  const startDate = props.reservation.startDate;

  if (!props.reservation || !props.reservation.id || !props.user || !props.user.id || !jwt) return null;

  if (
    props.reservation.status !== 'VALIDATED' ||
    (((props.reservation.author as UserType).id !== props.user.id || props.user.role !== 'ADMIN') &&
      isBefore(now, new Date(new Date(startDate).setMinutes(startDate.getMinutes() - 5)))) ||
    isAfter(now, props.reservation.endDate)
  )
    return null;

  return (
    <JaaSMeeting
      appId={appId}
      roomName={`${(props.reservation.author as UserType).name} x ${admin.name}`}
      configOverwrite={{
        startWithAudioMuted: false,
        disableModeratorIndicator: true,
        enableEmailInStats: false,
      }}
      jwt={jwt}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '500px';
      }}
    />
  );
}
