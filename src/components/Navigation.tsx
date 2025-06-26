import { useState, useEffect, useRef } from "react";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ctaPos, setCtaPos] = useState<{left: number, top: number} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      updateCtaPos();
    };
    const handleResize = () => {
      updateCtaPos();
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    updateCtaPos();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateCtaPos = () => {
    if (navbarRef.current) {
      const rect = navbarRef.current.getBoundingClientRect();
      setCtaPos({
        left: rect.right + 16,
        top: rect.top,
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'testimonials') {
      const testimonialSection = document.querySelector('.animate-marquee');
      if (testimonialSection) {
        const yOffset = -100;
        const y = testimonialSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else if (sectionId === 'cta') {
      const ctaSection = document.querySelector('.button-gradient');
      if (ctaSection) {
        const yOffset = -100;
        const y = ctaSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSectionNav = (sectionId: string) => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollToSection', sectionId);
      navigate('/');
    } else {
      scrollToSection(sectionId);
    }
  };

  const navItems = [
    { name: "Features", href: "#features", onClick: () => handleSectionNav('features') },
    
    { name: "Pricing", href: "#pricing", onClick: () => handleSectionNav('pricing') },
    { name: "Courses", href: "/courses", onClick: () => navigate('/courses') },
    { name: "Learning", href: "/learning", onClick: () => navigate('/learning') },
    { name: "About", href: "#about", onClick: () => handleSectionNav('about') },
  ];

  return (
    <>
      <header
        ref={navbarRef}
        className={`fixed top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${
          isScrolled 
            ? "h-14 bg-[#1B1B1B]/40 backdrop-blur-xl border border-white/10 scale-95 w-[90%] max-w-2xl" 
            : "h-14 bg-[#1B1B1B] w-[95%] max-w-3xl"
        }`}
      >
        <div className="mx-auto h-full px-6">
          <nav className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="font-bold text-base">AdaptiveLearning</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10 ml-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
              {/* Only show Start Learning button when not scrolled */}
              {!isScrolled && (
                <Button 
                  onClick={() => navigate('/learning')}
                  size="sm"
                  className="button-gradient"
                >
                  Start Learning
                </Button>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="glass">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#1B1B1B]">
                  <div className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMobileMenuOpen(false);
                          if (item.onClick) {
                            item.onClick();
                          }
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                    <Button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/learning');
                      }}
                      className="button-gradient mt-4"
                    >
                      Start Learning
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>
      {/* Floating Start Learning Button when scrolled */}
      {isScrolled && ctaPos && (
        <Button
          onClick={() => navigate('/learning')}
          size="lg"
          className="button-gradient fixed z-[60] shadow-lg hidden md:inline-flex transition-all duration-300 ease-in-out opacity-0 translate-y-2 will-change-transform"
          style={{
            minWidth: 140,
            left: ctaPos.left,
            top: ctaPos.top,
            height: '56px',
            lineHeight: '56px',
            paddingTop: 0,
            paddingBottom: 0,
            opacity: 1,
            transform: `translateY(0)`
          }}
        >
          Start Learning
        </Button>
      )}
    </>
  );
};

export default Navigation;
