import { Award, Book, Briefcase, Paperclip } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

import ContactForm from '@/components/ContactForm';
import { CircledArrow, Professor, Underline } from '@/components/svg';
import MailSvg from '@/components/svg/Mail';
import { TypographyH1, TypographyH2, TypographyH3, TypographyLead, TypographyMuted } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const JapaneseTeacherLanding = () => {
  return (
    <div className="relative overflow-x-hidden">
      <main className="container mx-auto px-4 py-8 m-5 max-w-[1100px]">
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

        <div className="max-w-[600px] block lg:hidden mb-5 text-center sm:text-start">
          <TypographyH2>Welcome to My Japanese Learning World!</TypographyH2>
          <TypographyMuted>
            こんにちは (Konnichiwa)! I&apos;m Keita Yasue, a passionate Japanese language teacher. Whether you&apos;re a beginner
            or looking to polish your skills, I&apos;m here to guide you on your Japanese language journey.
          </TypographyMuted>
        </div>

        <section id="about" className="mb-16">
          <TypographyH2>My Services</TypographyH2>
          <div>
            <div className="relative flex flex-wrap justify-between items-center">
              <img src="/keita.png" alt="keita yasue" width={400} />
              <div className="bg-[#ff920f70] w-[400px] h-[400px] absolute top-0 z-[-1000] rounded-full" />
              <div className="max-w-[600px] hidden lg:block">
                <TypographyH2>Welcome to My Japanese Learning World!</TypographyH2>
                <TypographyLead>
                  こんにちは (Konnichiwa)! I&apos;m Keita Yasue, a passionate Japanese language teacher. Whether you&apos;re a
                  beginner or looking to polish your skills, I&apos;m here to guide you on your Japanese language journey.
                </TypographyLead>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ServiceCard
                  icon={<Book />}
                  title="One-on-one Lessons"
                  description="Personalized online or in-person Japanese lessons"
                />
                {/* <ServiceCard icon={<Users />} title="Group Classes" description="Interactive group classes for all levels" /> */}
                <ServiceCard icon={<Briefcase />} title="Business Japanese" description="Specialized lessons for professionals" />
                <ServiceCard
                  icon={<Award />}
                  title="JLPT Preparation"
                  description="Focused training for the Japanese Language Proficiency Test"
                />
                <ServiceCard
                  icon={<Paperclip />}
                  title="Cultural Workshops"
                  description="Explore calligraphy, origami, and tea ceremony"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="recommandations" className="mb-16">
          <TypographyH2>Recommandations</TypographyH2>
          <TypographyMuted>TODO</TypographyMuted>
        </section>

        <section id="start" className="text-center">
          <TypographyH2>Get Started Today!</TypographyH2>
          <TypographyMuted>Ready to embark on your Japanese language adventure?</TypographyMuted>
          <Link href="/dashboard" className={cn(buttonVariants(), 'rounded-full mt-5')}>
            Sign in
          </Link>
          <div className="flex justify-center mt-5">
            <CircledArrow color="#ff920f" />
          </div>
        </section>

        <section id="contact" className="mt-5 flex items-center justify-around w-full">
          <div className="hidden lg:block">
            <MailSvg width={400} height={400} />
          </div>
          <ContactForm />
        </section>

        <section id="meetup" className="mt-16">
          <TypographyH2>Meetup events</TypographyH2>
          <iframe src="https://widgets.sociablekit.com/meetup-group-events/iframe/25471111" width="100%" height="690"></iframe>
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
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center">
    <div className="text-[#fffcf7] bg-primary-color w-fit h-fit p-3 rounded-full mr-5">{icon}</div>
    <div>
      <TypographyH3>{title}</TypographyH3>
      <TypographyMuted>{description}</TypographyMuted>
    </div>
  </div>
);

export default JapaneseTeacherLanding;
