'use client';
import { CircleCheckBig, CircleX, Loader, NotepadText } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type UpdateReservationReviewProps = {
  id: string;
  review: string | null;
};

export default function UpdateReservationReview({ id, review }: UpdateReservationReviewProps) {
  const [newReview, setNewReview] = useState<string | null>(review ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (id && newReview) {
      setLoading(true);
      const result = await fetch('/api/reservations/update', {
        method: 'POST',
        body: JSON.stringify({
          id,
          studentReview: JSON.stringify(newReview),
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
      setOpen(false);
    }
  }, [id, newReview]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-5 my-1">
          <NotepadText />
          Update review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update lesson&apos;s review</DialogTitle>
        </DialogHeader>
        <div>
          <DialogDescription>
            Your review
            <Textarea
              className="mt-2"
              placeholder="Type your review here."
              value={newReview ?? ''}
              onChange={(e) => setNewReview(e.target.value)}
              rows={20}
            />
          </DialogDescription>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <Loader className="mr-2 animate-spin" /> Submitting...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
