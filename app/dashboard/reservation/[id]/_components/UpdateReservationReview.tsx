'use client';
import { CircleCheckBig, CircleX, Loader } from 'lucide-react';
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
  const [newReview, setNewReview] = useState<string | null>(review);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (id && newReview) {
      setLoading(true);
      const result = await fetch('/api/reservations', {
        method: 'POST',
        body: JSON.stringify({
          review: newReview,
          updatedAt: new Date(),
        }),
      });

      if (result.status === 500)
        toast('An error occurred', {
          description: 'Could not updated the review',
          icon: <CircleX />,
        });
      else
        toast("Review's updated", {
          description: id,
          icon: <CircleCheckBig />,
        });

      setLoading(false);
    }
  }, [id, newReview]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-5 my-1">Update review</Button>
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
