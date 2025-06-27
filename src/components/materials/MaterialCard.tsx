import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Download, Eye, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  url: string;
  previewUrl: string;
  driveUrl?: string;
}

interface MaterialCardProps {
  material: Material;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const navigate = useNavigate();
  const handlePreview = () => {
    navigate(`/studymaterial/${material.id}`);
  };
  const handleDownload = () => {
    window.open(material.url, '_blank');
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + material.url);
    // Optionally, show a toast/notification
  };
  return (
    <Card className="flex flex-col h-full glass border-white/10 hover:shadow-xl transition-shadow">
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-background/30 flex items-center justify-center">
        <img
          src={material.previewUrl}
          alt={material.title}
          className="object-contain h-full w-full"
        />
        <Badge className="absolute top-2 left-2 z-10" variant="secondary">{material.category}</Badge>
        <Badge className="absolute top-2 right-2 z-10" variant="outline">{material.fileType}</Badge>
      </div>
      <CardHeader className="flex-1 pb-2">
        <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
        <CardDescription className="line-clamp-2 mb-2">{material.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between pt-0 mt-auto gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Preview" onClick={handlePreview}>
                <Eye className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Download" onClick={handleDownload}>
                <Download className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Link</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}; 