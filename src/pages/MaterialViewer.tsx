import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { sampleMaterials } from './StudyMaterial';

const getDriveEmbedUrl = (driveUrl: string) => {
  // Extract file ID from Google Drive share link
  const match = driveUrl.match(/\/d\/([\w-]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return '';
};

const MaterialViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const material = sampleMaterials.find(mat => mat.id === id);

  if (!material) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Material not found.</div>;
  }

  const handleDownload = () => {
    window.open(material.url, '_blank');
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen bg-black text-foreground pt-28 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">{material.title}</h1>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
        <p className="mb-4 text-muted-foreground">{material.description}</p>
        <div className="w-full rounded-lg overflow-hidden bg-background/30" style={{ minHeight: 500 }}>
          {material.driveUrl ? (
            <iframe
              src={getDriveEmbedUrl(material.driveUrl)}
              width="100%"
              height="600"
              allow="autoplay"
              style={{ border: 'none', borderRadius: '8px' }}
              title={material.title}
            />
          ) : (
            <div className="text-center py-20 text-lg">No preview available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialViewer; 