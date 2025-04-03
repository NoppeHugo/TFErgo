import React from 'react';

const ActivityFileViewer = ({ file }) => {
  const isImage = file.fileType.startsWith('image/');
  const isPdf = file.fileType === 'application/pdf';
  const isAudio = file.fileType.startsWith('audio/');
  const isVideo = file.fileType.startsWith('video/');

  return (
    <div className="mt-2">
      <p className="text-sm font-medium text-gray-700">{file.fileName}</p>
      {isImage && <img src={file.fileUrl} alt={file.fileName} className="max-w-full h-auto" />}
      {isPdf && <iframe src={file.fileUrl} title={file.fileName} className="w-full h-64" />}
      {isAudio && <audio controls src={file.fileUrl} className="w-full" />}
      {isVideo && <video controls src={file.fileUrl} className="w-full" />}
    </div>
  );
};

export default ActivityFileViewer;
