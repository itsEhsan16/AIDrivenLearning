import { Github, Twitter, BookOpen, Brain, Linkedin } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="w-full py-8 md:py-12 mt-20">
      <div className="container px-4">
        <div className="glass glass-hover rounded-xl p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 text-sm md:text-base">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">AdaptiveLearning</h3>
              <p className="text-sm text-muted-foreground">
                Empowering learners with AI-powered personalized education paths.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/itsEhsan16" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </Button>
                </a>
                <a href="https://www.linkedin.com/in/mdehsan1611" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Learning</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Learning Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Study Materials
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} AdaptiveLearning. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
