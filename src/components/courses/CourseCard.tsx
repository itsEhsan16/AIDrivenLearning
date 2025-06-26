import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Bookmark, BookmarkCheck, Heart, Star } from 'lucide-react';

interface Review {
  user: string;
  rating: number;
  comment: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  platform: string;
  rating: number;
  ratingCount: number;
  image: string;
  trending?: boolean;
  price: string;
  skillLevel: string;
  category: string;
  tags: string[];
  likes: number;
  bookmarked: boolean;
  reviews: Review[];
}

interface CourseCardProps {
  course: Course;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onReviewClick?: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onLike, onBookmark, onReviewClick }) => {
  return (
    <Card className="flex flex-col h-full glass border-white/10">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        {course.trending && (
          <Badge className="absolute top-2 left-2 z-10" variant="secondary">🔥 Trending</Badge>
        )}
        <Badge className="absolute top-2 right-2 z-10" variant="outline">{course.platform}</Badge>
      </div>
      <CardHeader className="flex-1 pb-2">
        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2 mb-2">{course.description}</CardDescription>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>By <span className="font-medium text-foreground">{course.instructor}</span></span>
          <span>•</span>
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-0.5 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(course.rating) ? 'fill-yellow-400' : 'stroke-yellow-400'}`} fill={i < Math.round(course.rating) ? 'currentColor' : 'none'} />
            ))}
          </span>
          <span className="text-xs text-muted-foreground">{course.rating} ({course.ratingCount})</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {course.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary">{course.skillLevel}</Badge>
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant={course.price === 'Free' ? 'secondary' : 'outline'}>{course.price}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0 mt-auto">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Like" onClick={() => onLike?.(course.id)}>
                  <Heart className={`w-5 h-5 ${course.likes > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Like ({course.likes})</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Bookmark" onClick={() => onBookmark?.(course.id)}>
                  {course.bookmarked ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{course.bookmarked ? 'Bookmarked' : 'Bookmark'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button variant="link" size="sm" className="text-xs" onClick={() => onReviewClick?.(course.id)}>
          {course.reviews.length > 0 ? `${course.reviews.length} Reviews` : 'Write a Review'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 