'use client';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Card, CardHeader } from './ui/card';

const Viewer = dynamic(() => import('@toast-ui/react-editor').then((mod) => mod.Viewer), { ssr: false });

type MarkdownViewerProps = {
  content: string;
};

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <Card>
      <CardHeader>
        <Viewer initialValue={content} />
      </CardHeader>
    </Card>
  );
}
