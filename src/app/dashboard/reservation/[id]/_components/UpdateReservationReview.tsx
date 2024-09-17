'use client';
import { Loader } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { ReservationServiceIns } from '@/services';

type UpdateReservationReviewProps = {
  id: string;
  review?: string;
};

export default function UpdateReservationReview({ id, review }: UpdateReservationReviewProps) {
  const [newReview, setNewReview] = useState<string | undefined>(review);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (id && newReview) {
      setLoading(true);
      ReservationServiceIns.updateOne(id, {
        review: newReview,
        updatedAt: new Date(),
      })
        .then((data) => {
          if (!data.error) {
            toast({
              title: "Review's updated",
              description: id,
              variant: 'success',
            });
          } else {
            toast({
              description: 'Could not updated the review',
              title: 'An error occurred',
              variant: 'destructive',
            });
          }
        })
        .catch(() => {
          toast({
            description: 'Could not updated the review',
            title: 'An error occurred',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
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
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
          </DialogDescription>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <Loader className="mr-2" /> Submitting...
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
