'use client';
import { send } from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { admin } from '@/constants/admin';
import { NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_SERVICE_ID } from '@/constants/env';
import { toast } from '@/hooks/use-toast';
import '@/lib/email';

import { TypographyH2 } from './typography';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';

const FormSchema = z.object({
  from_name: z
    .string()
    .min(1, {
      message: 'Your name must be at least 1 character.',
    })
    .max(160, {
      message: 'Your name must not be longer than 30 characters.',
    }),
  from_email: z.string().email(),
  message: z.string().min(10, {
    message: 'Your message must be at least 10 character.',
  }),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData = {
      ...data,
      to_name: admin.name,
      to_email: admin.email,
      reply_to: data.from_email,
    };

    try {
      const response = await send(NEXT_PUBLIC_EMAILJS_SERVICE_ID!, NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!, newData);

      if (response.status === 200) {
        toast({
          title: 'Message sent',
          description: 'I will respond to your message within 24 hours',
          variant: 'success',
        });
      } else throw new Error(response.text);
    } catch (e) {
      console.error(e);
      toast({
        title: 'An error occurred...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <TypographyH2>Contact</TypographyH2>
        <CardDescription>
          Thank you for your interest in Japanese lessons! I will respond to your message within 24 hours.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent>
            <div className="grid w-full gap-4">
              <FormField
                control={form.control}
                name="from_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email (email@domain.com)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your message here." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Send message</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
