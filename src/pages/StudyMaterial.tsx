import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { MaterialCard } from '@/components/materials/MaterialCard';
import { MaterialFilters } from '@/components/materials/MaterialFilters';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const sampleMaterials = [
  {
    id: '1',
    title: 'Python Basics Notes',
    description: 'Comprehensive notes covering Python fundamentals.',
    category: 'Programming',
    fileType: 'PDF',
    url: '/materials/python-basics.pdf',
    previewUrl: '/materials/python-basics-preview.png',
    driveUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing',
  },
  {
    id: '2',
    title: 'Calculus Cheat Sheet',
    description: 'Quick reference for calculus formulas and concepts.',
    category: 'Math',
    fileType: 'PDF',
    url: '/materials/calculus-cheatsheet.pdf',
    previewUrl: '/materials/calculus-cheatsheet-preview.png',
    driveUrl: 'https://drive.google.com/file/d/2B3C4D5E6F7G8H9I0J1A/view?usp=sharing',
  },
  {
    id: '3',
    title: 'Organic Chemistry Summary',
    description: 'Key points and reactions in organic chemistry.',
    category: 'Science',
    fileType: 'DOCX',
    url: '/materials/organic-chemistry.docx',
    previewUrl: '/materials/organic-chemistry-preview.png',
    driveUrl: 'https://drive.google.com/file/d/3C4D5E6F7G8H9I0J1A2B/view?usp=sharing',
  },
  {
    id: '4',
    title: 'JavaScript Interview Questions',
    description: 'Frequently asked JS interview questions and answers.',
    category: 'Programming',
    fileType: 'PDF',
    url: '/materials/js-interview.pdf',
    previewUrl: '/materials/js-interview-preview.png',
    driveUrl: 'https://drive.google.com/file/d/4D5E6F7G8H9I0J1A2B3C/view?usp=sharing',
  },
  {
    id: '5',
    title: 'World History Timeline',
    description: 'A visual timeline of major world history events.',
    category: 'History',
    fileType: 'PDF',
    url: '/materials/world-history.pdf',
    previewUrl: '/materials/world-history-preview.png',
    driveUrl: 'https://drive.google.com/file/d/5E6F7G8H9I0J1A2B3C4D/view?usp=sharing',
  },
];

const categories = ['All', 'Programming', 'Math', 'Science', 'History'];

const StudyMaterial = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredMaterials = sampleMaterials.filter((mat) => {
    const matchesCategory = category === 'All' || mat.category === category;
    const matchesSearch =
      mat.title.toLowerCase().includes(search.toLowerCase()) ||
      mat.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-foreground pt-28">
      <Navigation />
      <section className="container px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Study Material Library</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse, read, share, and download high-quality educational resources for every subject.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <Input
              type="text"
              placeholder="Search study materials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="md:w-96 w-full"
            />
            <MaterialFilters
              categories={categories}
              selected={category}
              onSelect={setCategory}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map(mat => (
              <MaterialCard key={mat.id} material={mat} />
            ))}
          </div>
          {filteredMaterials.length === 0 && (
            <div className="text-center text-muted-foreground mt-16 text-lg">No materials found.</div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default StudyMaterial; 