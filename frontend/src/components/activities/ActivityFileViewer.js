import React from 'react';

const ActivityFileViewer = ({ files }) => {
  if (!files || files.length === 0) return null;

  const imageFiles = files.filter(f => f.fileType.startsWith('image/'));
  const otherFiles = files.filter(f => !f.fileType.startsWith('image/'));
  const visibleImages = imageFiles.slice(0, 3);
  const extraCount = imageFiles.length > 3 ? imageFiles.length - 3 : 0;

  return (
    <div className="mt-2 space-y-2">
      {imageFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {visibleImages.slice(0, 2).map((file, index) => (
            <div
              key={file.id}
              className="relative aspect-square overflow-hidden rounded"
            >
              <img
                src={file.fileUrl}
                alt="Image activité"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {visibleImages[2] && (
            <div className="col-span-2 relative h-[100px] overflow-hidden rounded">
              <img
                src={visibleImages[2].fileUrl}
                alt="Image activité"
                className="w-full h-full object-cover"
              />
              {extraCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold">
                  +{extraCount}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {otherFiles.length > 0 && (
        <div className="space-y-1">
          {otherFiles.map((file) => {
            if (file.fileType === 'application/pdf') {
              return <iframe key={file.id} src={file.fileUrl} className="w-full h-32 rounded" />;
            }
            if (file.fileType.startsWith('audio/')) {
              return <audio key={file.id} controls src={file.fileUrl} className="w-full" />;
            }
            if (file.fileType.startsWith('video/')) {
              return <video key={file.id} controls src={file.fileUrl} className="w-full" />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFileViewer;