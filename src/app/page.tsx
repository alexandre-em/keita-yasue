import { Award, Book, Briefcase, Paperclip } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { CircledArrow, Professor, Underline } from '@/components/svg';
import { TypographyH1, TypographyH2, TypographyH3, TypographyLead, TypographyMuted } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const JapaneseTeacherLanding = () => {
  return (
    <div className="relative">
      <main className="container mx-auto px-4 py-8 m-5">
        <section id="hero" className="text-center py-16">
          <TypographyH1>Keita Yasue</TypographyH1>
          <TypographyLead>Japanese Language Teacher</TypographyLead>
          <div className="mt-8 inline-block animate-bounce">
            <Underline color="#ff920f" width={200} height={50} />
          </div>
          <div className="hidden sm:flex flex-wrap justify-center">
            <Professor width={500} height={200} />
            <div className="absolute bg-[#b07edf45] z-[-90] w-[200px] h-[200px] rounded-full"></div>
          </div>
        </section>

        <section id="about" className="mb-16">
          <TypographyH2>Welcome to My Japanese Learning World!</TypographyH2>
          <TypographyMuted>
            こんにちは (Konnichiwa)! I'm Keita Yasue, a passionate Japanese language teacher. Whether you're a beginner or looking
            to polish your skills, I'm here to guide you on your Japanese language journey.
          </TypographyMuted>
        </section>

        <section id="services" className="mb-16">
          <TypographyH2>My Services</TypographyH2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </section>

        <section id="recommandations" className="mb-16">
          <TypographyH2>Recommandations</TypographyH2>
          <TypographyMuted>TODO</TypographyMuted>
        </section>

        <section id="contact" className="text-center">
          <TypographyH2>Get Started Today!</TypographyH2>
          <TypographyMuted>
            Ready to embark on your Japanese language adventure? Contact me for a free consultation or to schedule your first
            lesson.
          </TypographyMuted>
          <Link href="/dashboard" className={cn(buttonVariants(), 'rounded-full mt-5')}>
            Sign in
          </Link>
          <div className="flex justify-center mt-5">
            <CircledArrow color="#ff920f" />
          </div>
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

const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <div className="text-[#fffcf7] bg-[#e7740a] w-fit p-3 rounded-full">{icon}</div>
    <TypographyH3>{title}</TypographyH3>
    <TypographyMuted>{description}</TypographyMuted>
  </div>
);

export default JapaneseTeacherLanding;
