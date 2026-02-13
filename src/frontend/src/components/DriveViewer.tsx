import { useState } from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOfflineLibrary } from '@/hooks/useOfflineLibrary';

interface DriveViewerProps {
  urls: string[];
  title: string;
  onDownload?: () => void;
}

export default function DriveViewer({ urls, title, onDownload }: DriveViewerProps) {
  const [embedError, setEmbedError] = useState(false);
  const { addItem } = useOfflineLibrary();

  const handleDownload = () => {
    urls.forEach((url) => {
      addItem({ id: url, title, url, type: 'document' });
      window.open(url, '_blank');
    });
    onDownload?.();
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('/file/d/')) {
      const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
    }
    if (url.includes('/folders/')) {
      const folderId = url.match(/\/folders\/([^/?]+)/)?.[1];
      return folderId ? `https://drive.google.com/embeddedfolderview?id=${folderId}` : null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(urls[0]);

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            अफलाइन सुरक्षित गर्नुहोस्
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(urls[0], '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            खोल्नुहोस्
          </Button>
        </div>
      </div>
      {embedError || !embedUrl ? (
        <div className="p-8 text-center space-y-4">
          <Alert>
            <AlertDescription>
              यो कागजात एम्बेड गर्न असमर्थ। यसलाई नयाँ ट्याबमा हेर्न तलको बटन क्लिक गर्नुहोस्।
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.open(urls[0], '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Google Drive मा खोल्नुहोस्
          </Button>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          className="w-full h-[600px]"
          onError={() => setEmbedError(true)}
          title={title}
        />
      )}
    </Card>
  );
}
