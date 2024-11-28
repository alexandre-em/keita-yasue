import { Award, Book, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

import ContactForm from '@/components/ContactForm';
import PriceCards from '@/components/PriceCards';
import { Professor, Underline } from '@/components/svg';
import ChattingSvg from '@/components/svg/Chatting';
import MailSvg from '@/components/svg/Mail';
import { TypographyH1, TypographyH2, TypographyH3, TypographyLead, TypographyMuted } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const JapaneseTeacherLanding = () => {
  return (
    <div className="relative overflow-x-hidden">
      <main className="container mx-auto px-4 py-8 m-5">
        <section id="hero" className="text-center py-16">
          <TypographyH1>Keita Yasue</TypographyH1>
          <TypographyLead>Japanese Language Teacher</TypographyLead>
          <div className="mt-8 inline-block animate-bounce">
            <Underline color="#ff920f" width={200} height={50} />
          </div>
          <div className="flex flex-wrap justify-center items-center">
            <Professor width={500} height={200} />
            <div className="absolute bg-[#b07edf45] z-[-90] w-[200px] h-[200px] rounded-full"></div>
          </div>
        </section>

        <section id="about" className="flex flex-col w-full items-center mt-10">
          <div className="max-w-[800px] mb-5 text-center md:text-start">
            <TypographyH2>Welcome to My Japanese Learning World!</TypographyH2>
            <TypographyMuted>
              こんにちは (Konnichiwa)! I&apos;m Keita Yasue, a passionate Japanese language teacher. Whether you&apos;re a
              beginner or looking to polish your skills, I&apos;m here to guide you on your Japanese language journey.
            </TypographyMuted>
          </div>

          <div className="mb-16">
            <TypographyH2>My Services</TypographyH2>
            <div>
              <div className="relative flex flex-wrap justify-center items-center">
                <img src="/keita.png" alt="keita yasue" width={400} />
                <div className="bg-[#ff920f70] w-[400px] h-[400px] absolute top-0 left-0 z-[-1000] rounded-full" />
                <div className="grid grid-cols-1 gap-8">
                  <ServiceCard
                    icon={<Book />}
                    title="One-on-one Lessons"
                    description="Personalized online or in-person Japanese lessons"
                  />
                  <ServiceCard icon={<Users />} title="Group Classes" description="Interactive group classes for all levels" />
                  <ServiceCard
                    icon={<Briefcase />}
                    title="Business Japanese"
                    description="Specialized lessons for professionals"
                  />
                  <ServiceCard
                    icon={<Award />}
                    title="JLPT Preparation"
                    description="Focused training for the Japanese Language Proficiency Test"
                  />
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </section>

        <section id="pricing" className="flex flex-col items-center mt-10">
          <TypographyH2>Pricing</TypographyH2>
          <PriceCards />
        </section>

        <section id="start" className="flex flex-col items-center text-center mt-10">
          <TypographyH2>Get Started Today!</TypographyH2>
          <TypographyMuted>Ready to embark on your Japanese language adventure?</TypographyMuted>
          <Link href="/dashboard" className={cn(buttonVariants(), 'rounded-full mt-5')}>
            Sign in
          </Link>
          <div className="mt-2">
            <ChattingSvg width={500} height={170} />
          </div>
        </section>

        <section id="meetup" className="mt-5">
          <TypographyH2>Meetup events</TypographyH2>
          <iframe src="https://widgets.sociablekit.com/meetup-group-events/iframe/25471111" width="100%" height="690"></iframe>
        </section>

        <section id="contact" className="flex items-center justify-around w-full">
          <div className="hidden md:block">
            <MailSvg width={400} height={400} />
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <TypographyMuted>&copy;{new Date().getFullYear()} Keita Yasue. All rights reserved.</TypographyMuted>
        </div>
      </footer>
      <div className="absolute bg-primary-color w-[80px] h-[80px] top-0 right-8 rounded-full opacity-60 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[80dvw] h-[80dvw] max-h-[800px] max-w-[1000px] bottom-0 rounded-tr-full opacity-10 z-[-999]"></div>
    </div>
  );
};

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
  <div className="max-w-lg bg-white md:bg-transparent p-6 md:p-0 rounded-lg md:shadow-none md:hover:shadow-none shadow-md hover:shadow-lg transition duration-300 flex items-center">
    <div className="text-[#fffcf7] bg-primary-color w-fit h-fit p-3 rounded-full mr-5">{icon}</div>
    <div>
      <TypographyH3>{title}</TypographyH3>
      <TypographyMuted>{description}</TypographyMuted>
    </div>
  </div>
);

export default JapaneseTeacherLanding;
