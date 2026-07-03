import { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Slideshow, projectsList } from './Home';
import { content, TextSection } from '../content';

const caseStudy = content.caseStudy;

function CaseStudySection({ section }: { section: TextSection }) {
  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <h2 className="text-neutral-900">{section.heading}</h2>
      {section.paragraphs.map((text, i) => (
        <p key={i} className="text-neutral-900 leading-relaxed">
          {text}
        </p>
      ))}
    </div>
  );
}

export default function Project() {
  const scrollRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollTop(scrollRef.current.scrollTop > 200);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Attempt to scroll to top on page load
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto relative bg-white pb-32">
      <div className="px-6 md:px-8 lg:px-16 pt-24 md:pt-32">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-32 mb-16 md:mb-24">
          <div className="flex flex-col gap-16 md:gap-24 w-full md:w-1/2">
            <p className="text-neutral-900 leading-relaxed max-w-sm">
              {caseStudy.intro}
            </p>
            <p className="text-neutral-400">{caseStudy.label}</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full md:w-auto">
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400">company</span>
              <span className="text-neutral-900">{caseStudy.meta.company}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400">services</span>
              <div className="flex flex-col text-neutral-900">
                {caseStudy.meta.services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400">industry</span>
              <span className="text-neutral-900">{caseStudy.meta.industry}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400">year</span>
              <span className="text-neutral-900">{caseStudy.meta.year}</span>
            </div>
          </div>
        </div>

        {/* Content Flow */}
        <div className="flex flex-col gap-16 md:gap-24">
          <img src={caseStudy.hero} alt="Hero" className="w-full aspect-[16/9] object-cover bg-neutral-100" />

          <CaseStudySection section={caseStudy.section1} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudy.gridA.map((src, i) => (
              <img key={i} src={src} alt={`Grid ${i + 1}`} className="w-full aspect-[4/3] md:aspect-[4/3] object-cover bg-neutral-100" />
            ))}
          </div>

          <img src={caseStudy.fullA} alt="Full 2" className="w-full aspect-[16/9] object-cover bg-neutral-100" />

          <CaseStudySection section={caseStudy.section2} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudy.gridB.map((src, i) => (
              <img key={i} src={src} alt={`Grid ${i + 3}`} className="w-full aspect-[4/3] md:aspect-[4/3] object-cover bg-neutral-100" />
            ))}
          </div>

          <CaseStudySection section={caseStudy.section3} />

          <img src={caseStudy.fullB} alt="Full 3" className="w-full aspect-[16/9] object-cover bg-neutral-100" />
        </div>

        {/* More Projects */}
        <div className="mt-32 -mx-6 md:-mx-8 lg:-mx-16">
          <div className="px-6 md:px-8 lg:px-16 mb-8">
            <p className="text-neutral-900">{caseStudy.moreProjectsLabel}</p>
          </div>
          <Slideshow items={projectsList} />
        </div>
      </div>
      
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 mb-6 w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center z-50 focus:outline-none"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </main>
  );
}
