import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Placeholder course data
const courses = [
  {
    id: '1',
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the basics of AI, including machine learning, neural networks, and more.',
    instructor: 'Andrew Ng',
    duration: '8 hrs',
    platform: 'Coursera',
    rating: 4.8,
    ratingCount: 12000,
    image: '/lovable-uploads/0dbe1b75-2c74-4ff8-ba55-4be4d74abe72.png',
    trending: true,
    price: 'Free',
    skillLevel: 'Beginner',
    category: 'AI',
    tags: ['AI', 'Machine Learning', 'Neural Networks'],
    likes: 320,
    bookmarked: false,
    reviews: [
      { user: 'Jane Doe', rating: 5, comment: 'Great intro to AI!' },
      { user: 'John Smith', rating: 4, comment: 'Very informative.' },
    ],
  },
  {
    id: '2',
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, and Node.js to build modern web applications.',
    instructor: 'Colt Steele',
    duration: '12 hrs',
    platform: 'Udemy',
    rating: 4.7,
    ratingCount: 9500,
    image: '/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png',
    trending: true,
    price: 'Paid',
    skillLevel: 'Intermediate',
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    likes: 210,
    bookmarked: false,
    reviews: [
      { user: 'Alice', rating: 5, comment: 'Covers everything for web dev!' },
      { user: 'Bob', rating: 4, comment: 'Great hands-on projects.' },
    ],
  },
  {
    id: '3',
    title: 'Data Science & Machine Learning with Python',
    description: 'Analyze data, build models, and visualize results using Python, pandas, and scikit-learn.',
    instructor: 'Kirill Eremenko',
    duration: '10 hrs',
    platform: 'edX',
    rating: 4.6,
    ratingCount: 8000,
    image: '/lovable-uploads/bb50362c-6879-4868-bbc9-c6e051fd8d7d.png',
    trending: false,
    price: 'Paid',
    skillLevel: 'Intermediate',
    category: 'Data Science',
    tags: ['Python', 'Data Science', 'Machine Learning', 'pandas'],
    likes: 180,
    bookmarked: false,
    reviews: [
      { user: 'Carlos', rating: 5, comment: 'Very practical and clear.' },
      { user: 'Diana', rating: 4, comment: 'Loved the Python exercises.' },
    ],
  },
  {
    id: '4',
    title: 'Cloud Computing Fundamentals',
    description: 'Understand cloud concepts, AWS, Azure, and Google Cloud basics for IT professionals.',
    instructor: 'Lynn Langit',
    duration: '6 hrs',
    platform: 'Coursera',
    rating: 4.5,
    ratingCount: 6000,
    image: '/lovable-uploads/1e2a48dc-059b-4919-a1ed-44685d771a32.png',
    trending: false,
    price: 'Free',
    skillLevel: 'Beginner',
    category: 'Cloud Computing',
    tags: ['Cloud', 'AWS', 'Azure', 'Google Cloud'],
    likes: 140,
    bookmarked: false,
    reviews: [
      { user: 'Eve', rating: 5, comment: 'Great for cloud beginners.' },
      { user: 'Frank', rating: 4, comment: 'Good overview of providers.' },
    ],
  },
  {
    id: '5',
    title: 'Cybersecurity Essentials',
    description: 'Learn the fundamentals of cybersecurity, including threats, vulnerabilities, and defense strategies.',
    instructor: 'Chuck Easttom',
    duration: '7 hrs',
    platform: 'Udemy',
    rating: 4.4,
    ratingCount: 5000,
    image: '/lovable-uploads/7cc724d4-3e14-4e7c-9e7a-8d613fde54d0.png',
    trending: false,
    price: 'Paid',
    skillLevel: 'Beginner',
    category: 'Cybersecurity',
    tags: ['Cybersecurity', 'Network Security', 'Threats'],
    likes: 120,
    bookmarked: false,
    reviews: [
      { user: 'Grace', rating: 5, comment: 'Very informative for beginners.' },
      { user: 'Henry', rating: 4, comment: 'Covers all the basics.' },
    ],
  },
  {
    id: '6',
    title: 'iOS & Android Mobile App Development',
    description: 'Build native and cross-platform mobile apps using Swift, Kotlin, and Flutter.',
    instructor: 'Angela Yu',
    duration: '9 hrs',
    platform: 'Coursera',
    rating: 4.7,
    ratingCount: 7000,
    image: '/lovable-uploads/a2c0bb3a-a47b-40bf-ba26-d79f2f9e741b.png',
    trending: true,
    price: 'Paid',
    skillLevel: 'Advanced',
    category: 'Mobile Development',
    tags: ['iOS', 'Android', 'Swift', 'Kotlin', 'Flutter'],
    likes: 160,
    bookmarked: false,
    reviews: [
      { user: 'Ivy', rating: 5, comment: 'Loved the Flutter section!' },
      { user: 'Jack', rating: 4, comment: 'Covers both iOS and Android well.' },
    ],
  },
];

const Courses = () => {
  // Filtering, sorting, pagination state would go here
  const [filteredCourses, setFilteredCourses] = useState(courses);

  return (
    <div className="min-h-screen bg-black text-foreground pt-28">
      <Navigation />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container px-4 pb-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Trending Technical Courses <Badge className="ml-2" variant="secondary">🔥 Trending</Badge>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular and highly rated courses in AI, Web Development, Data Science, and more.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="md:w-72 w-full mb-8 md:mb-0">
              <CourseFilters onFilter={setFilteredCourses} courses={courses} />
            </aside>
            {/* Course Listings */}
            <main className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <Pagination />
              </div>
            </main>
          </div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
};

export default Courses; 