import React, { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from './CourseCard';

interface CourseFiltersProps {
  courses: Course[];
  onFilter: (filtered: Course[]) => void;
}

const categories = ['AI', 'Web Development', 'Data Science', 'Cloud Computing'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
const durations = ['< 5 hrs', '5–10 hrs', '> 10 hrs'];
const ratings = [4, 4.5, 5];
const platforms = ['Coursera', 'Udemy', 'edX', 'YouTube'];
const prices = ['Free', 'Paid'];

export const CourseFilters: React.FC<CourseFiltersProps> = ({ courses, onFilter }) => {
  const [category, setCategory] = useState<string | undefined>();
  const [skillLevel, setSkillLevel] = useState<string | undefined>();
  const [duration, setDuration] = useState<string | undefined>();
  const [rating, setRating] = useState<number | undefined>();
  const [platform, setPlatform] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();

  const handleFilter = () => {
    let filtered = [...courses];
    if (category) filtered = filtered.filter(c => c.category === category);
    if (skillLevel) filtered = filtered.filter(c => c.skillLevel === skillLevel);
    if (duration) {
      if (duration === '< 5 hrs') filtered = filtered.filter(c => parseInt(c.duration) < 5);
      if (duration === '5–10 hrs') filtered = filtered.filter(c => parseInt(c.duration) >= 5 && parseInt(c.duration) <= 10);
      if (duration === '> 10 hrs') filtered = filtered.filter(c => parseInt(c.duration) > 10);
    }
    if (rating) filtered = filtered.filter(c => c.rating >= rating);
    if (platform) filtered = filtered.filter(c => c.platform === platform);
    if (price) filtered = filtered.filter(c => c.price === price);
    onFilter(filtered);
  };

  React.useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, [category, skillLevel, duration, rating, platform, price]);

  return (
    <div className="glass rounded-xl p-6 border-white/10 flex flex-col gap-6">
      <h3 className="text-lg font-semibold mb-2">Filter Courses</h3>
      <div className="flex flex-col gap-4">
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={skillLevel} onValueChange={setSkillLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Skill Level</SelectLabel>
                {skillLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Duration</SelectLabel>
                {durations.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Platform</SelectLabel>
                {platforms.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Price</SelectLabel>
                {prices.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={rating ? rating.toString() : undefined} onValueChange={v => setRating(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rating</SelectLabel>
                {ratings.map(r => (
                  <SelectItem key={r} value={r.toString()}>{r} stars & up</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button variant="outline" className="mt-4" onClick={() => {
        setCategory(undefined);
        setSkillLevel(undefined);
        setDuration(undefined);
        setRating(undefined);
        setPlatform(undefined);
        setPrice(undefined);
      }}>
        Clear Filters
      </Button>
    </div>
  );
}; 