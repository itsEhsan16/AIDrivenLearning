"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer & Lifelong Learner",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "AdaptiveLearning's personalized AI roadmap helped me master new programming languages efficiently. The progress tracking kept me motivated every day!"
  },
  {
    name: "Arjun Patel",
    role: "University Student",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "The platform's advanced AI models made complex topics easy to understand. I love how the learning plan adapts to my schedule and goals."
  },
  {
    name: "Dr. Emily Carter",
    role: "Education Consultant",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "As an educator, I recommend AdaptiveLearning for its innovative approach to personalized education. The analytics and reporting features are top-notch."
  },
  {
    name: "Rahul Verma",
    role: "Corporate Trainer",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    content: "Our team upskilled rapidly using the Enterprise plan. The custom onboarding and dedicated support made a huge difference for our organization."
  },
  {
    name: "Sofia Lopez",
    role: "Freelance Designer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "The community support and AI guidance helped me learn new design tools and techniques at my own pace. Highly recommended!"
  },
  {
    name: "Wei Zhang",
    role: "STEM Teacher",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    content: "AdaptiveLearning's curriculum customization and analytics dashboard have transformed how I support my students' growth."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-black">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-normal mb-4">Trusted by Learners & Educators</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied learners and educators on AdaptiveLearning
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-1`} className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-2`} className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;