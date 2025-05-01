'use client';
import React, { createRef, useCallback } from 'react';

import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from 'sonner';
import { CircleCheckBig, CircleX, Loader } from 'lucide-react';
import { Editor as EditorType } from '@toast-ui/react-editor';
import { Button } from './ui/button';

const Editor = dynamic(() => import('@toast-ui/react-editor').then((mod) => mod.Editor), { ssr: false });

type MarkdownEditorProps = {
  id: string;
  bodyKey: string;
  submitPath: string;
  content: string;
};

export default function MarkdownEditor({ id, bodyKey, submitPath, content }: MarkdownEditorProps) {
  const editorRef = createRef<EditorType>();
  const [loading, setLoading] = React.useState(false);

  const handleImageUpload = async (blob: Blob | Uint8Array | ArrayBuffer, callback: (url: string, key: string) => void) => {
    const fileName = `uploads/${Date.now()}-${(blob as unknown as File).name}`;
    const storageRef = ref(storage, fileName);

    try {
      setLoading(true);
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      callback(url, fileName);
      toast('Success !', {
        description: 'Your image has been uploaded successfully',
        icon: <CircleCheckBig />,
      });

      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      toast('An error occured while uploading the image', {
        description: 'Please try again later',
        icon: <CircleX />,
      });
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = useCallback(async () => {
    const eI = editorRef.current && editorRef.current.getInstance();
    const md = eI?.getMarkdown();
    if (md) {
      console.log({ md, bodyKey, submitPath, id });
      setLoading(true);
      const result = await fetch(submitPath, {
        method: 'POST',
        body: JSON.stringify({
          id,
          [bodyKey]: JSON.stringify(md),
          updatedAt: new Date(),
        }),
      });

      if (result.status === 500)
        toast('An error occurred', {
          description: 'Could not updated the review',
          icon: <CircleX />,
        });
      else {
        toast("Review's updated", {
          description: id,
          icon: <CircleCheckBig />,
        });
      }

      setLoading(false);
    }
  }, [id, bodyKey, submitPath, editorRef]);

  return (
    <>
      <Editor
        ref={editorRef}
        useCommandShortcut
        height="100%"
        weight="100%"
        initialEditType="wysiwyg"
        initialValue={content}
        hooks={{
          addImageBlobHook: handleImageUpload,
        }}
      />
      <Button disabled={loading} className="mt-4 w-full" onClick={handleSubmit}>
        {loading ? (
          <div className="flex items-center">
            <Loader className="mr-2 animate-spin" /> Loading...
          </div>
        ) : (
          'Save'
        )}
      </Button>
    </>
  );
}
