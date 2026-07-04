'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createIssueAction, getImageKitAuthenticationAction } from '@/app/actions';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { IssueCategory, IssuePriority } from '@/types';
import { AlertCircle, Image as ImageIcon, Loader2, UploadCloud, Video, X } from 'lucide-react';

const CATEGORIES: IssueCategory[] = [
  'Furniture',
  'Electrical',
  'Water Supply',
  'Toilets',
  'Sanitation',
  'Playground',
  'Building Damage',
  'Classroom',
  'Security',
  'Others',
];

const PRIORITIES: { value: IssuePriority; label: string; desc: string; color: string }[] = [
  { value: 'low', label: 'Low', desc: 'Convenience issues, minor wear', color: 'border-slate-300 dark:border-slate-800' },
  { value: 'medium', label: 'Medium', desc: 'Standard repair, doesn\'t block class', color: 'border-blue-200' },
  { value: 'high', label: 'High', desc: 'Affects classes or student comfort', color: 'border-orange-200' },
  { value: 'critical', label: 'Critical', desc: 'Immediate safety or operational hazard', color: 'border-red-200' },
];

interface UploadedFile {
  url: string;
  name: string;
  type: 'image' | 'video';
}

export default function ReportIssuePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Classroom');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');

  // Media states
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(10);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        toast({
          title: 'Invalid File Type',
          description: 'Only images and videos are allowed.',
          variant: 'error',
        });
        continue;
      }

      // Check size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds the 10MB file limit.`,
          variant: 'error',
        });
        continue;
      }

      setUploadProgress(30);

      // Perform actual ImageKit client upload if variables are configured
      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

      if (publicKey && urlEndpoint) {
        try {
          // Get signature
          const authData = await getImageKitAuthenticationAction();
          if (authData.error) {
            throw new Error(authData.error);
          }

          setUploadProgress(50);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileName', file.name);
          formData.append('publicKey', publicKey);
          formData.append('signature', authData.signature || '');
          formData.append('expire', String(authData.expire || 0));
          formData.append('token', authData.token || '');

          const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error('ImageKit upload request failed');
          }

          const result = await res.json();
          setUploadProgress(90);

          setMediaFiles((prev) => [
            ...prev,
            {
              url: result.url,
              name: file.name,
              type: isImage ? 'image' : 'video',
            },
          ]);

          toast({
            title: 'File Uploaded',
            description: `${file.name} was successfully uploaded to ImageKit.`,
            variant: 'success',
          });
        } catch (error) {
          console.error(error);
          toast({
            title: 'Upload Failed',
            description: 'Failed to upload file to ImageKit. Falling back to local preview.',
            variant: 'error',
          });
          
          // Local fallback simulator (convert to dataurl)
          await simulateLocalFile(file, isImage);
        }
      } else {
        // Safe local fallback simulation (when ImageKit variables are not entered yet)
        await simulateLocalFile(file, isImage);
      }
    }

    setUploading(false);
    setUploadProgress(null);
  };

  const simulateLocalFile = (file: File, isImage: boolean) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles((prev) => [
          ...prev,
          {
            url: reader.result as string,
            name: file.name,
            type: isImage ? 'image' : 'video',
          },
        ]);
        toast({
          title: 'File Loaded (Local Simulator)',
          description: `${file.name} loaded into browser memory. (Configure .env.local for live ImageKit uploads)`,
          variant: 'info',
        });
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim() || !building.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields marked with *',
        variant: 'error',
      });
      return;
    }

    const images = mediaFiles.filter((f) => f.type === 'image').map((f) => f.url);
    const videos = mediaFiles.filter((f) => f.type === 'video').map((f) => f.url);

    startTransition(async () => {
      const res = await createIssueAction({
        title,
        description,
        category,
        priority,
        location,
        building,
        room: room || 'N/A',
        images,
        videos,
      });

      if (res.error) {
        toast({
          title: 'Error Submitting Report',
          description: res.error,
          variant: 'error',
        });
      } else {
        toast({
          title: 'Report Submitted',
          description: 'Your facility issue has been reported. School administrators have been notified.',
          variant: 'success',
        });
        router.push('/dashboard/my-reports');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Report a Facility Issue</h2>
        <p className="text-xs text-muted mt-1">Submit infrastructure damages, electrical hazards, plumbing failures, or structural defects.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>Describe what needs repair and its exact location.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken overhead projector, Toilet flush leaking"
                  className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail. For example: The projector is flashing red lights and wont power on. It makes a high pitched whistling sound when plugged in."
                  rows={4}
                  className="w-full p-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueCategory)}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Text */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Location Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Block B First Floor Restroom, Playground Area"
                    className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Building */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Building/Block Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g. Main Block, Block B, Cafeteria"
                    className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Room Number / Area Name
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Room 204, Kitchen, Playground"
                    className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Attach Photo/Video evidence</CardTitle>
              <CardDescription>Drag and drop files or click to upload. Files are saved directly to ImageKit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted-background/10 hover:bg-muted-background/20 transition cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  onChange={handleMediaUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-muted mb-3" />
                <p className="text-sm font-semibold">Click to upload files</p>
                <p className="text-xs text-muted mt-1">Images (PNG, JPG) or Videos (MP4) up to 10MB</p>
              </div>

              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted border border-border rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Media Previews */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {mediaFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square border border-border rounded-lg overflow-hidden group bg-black/5 dark:bg-white/5">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <Video className="w-6 h-6 text-muted" />
                          <span className="text-[9px] text-muted truncate max-w-[90%] mt-1">{file.name}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info & Priority Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority Level</CardTitle>
              <CardDescription>Select severity to dictate resolution response timelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-0.5 ${
                    priority === p.value
                      ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                      : `${p.color} bg-transparent hover:bg-muted-background/40 text-muted-text`
                  }`}
                >
                  <span className={`font-semibold text-xs capitalize ${priority === p.value ? 'text-primary' : 'text-foreground'}`}>
                    {p.label} Priority
                  </span>
                  <span className="text-[10px] opacity-80 leading-normal">{p.desc}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isPending || uploading}
              className="flex w-full items-center justify-center h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-md shadow-primary/10 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Submit Condition Report'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex w-full items-center justify-center h-12 rounded-xl border border-border bg-card hover:bg-muted-background transition text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
