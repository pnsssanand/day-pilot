import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Camera, Video, Loader2, Save, Upload, X } from "lucide-react";

const Profile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [photoUrl, setPhotoUrl] = useState(userProfile?.photoUrl || "");
  const [videoUrl, setVideoUrl] = useState(userProfile?.videoUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);
    setPhotoProgress(0);

    try {
      const result = await uploadToCloudinary(file, setPhotoProgress);
      setPhotoUrl(result.secure_url);
      toast({
        title: "Photo uploaded!",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
      setPhotoProgress(0);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a video under 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(true);
    setVideoProgress(0);

    try {
      const result = await uploadToCloudinary(file, setVideoProgress);
      setVideoUrl(result.secure_url);
      toast({
        title: "Video uploaded!",
        description: "Your profile video has been added.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a display name.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        photoUrl: photoUrl || undefined,
        videoUrl: videoUrl || undefined,
      });
      toast({
        title: "Profile saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h1>

          <div className="space-y-6">
            {/* Profile Photo Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Photo</CardTitle>
                <CardDescription>
                  Upload a photo that will be shown in your greeting and navigation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-border">
                      <AvatarImage src={photoUrl} />
                      <AvatarFallback className="bg-gradient-hero text-primary-foreground text-2xl">
                        {displayName?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="absolute inset-0 bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Camera className="w-6 h-6 text-background" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="w-full sm:w-auto"
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </Button>

                    {uploadingPhoto && (
                      <Progress value={photoProgress} className="h-2" />
                    )}

                    {photoUrl && !uploadingPhoto && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPhotoUrl("")}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove photo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Video Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Video (Optional)</CardTitle>
                <CardDescription>
                  Add a short video introduction to your profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videoUrl && (
                    <div className="relative rounded-lg overflow-hidden bg-muted aspect-video max-w-md">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => setVideoUrl("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />

                  <Button
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadingVideo}
                  >
                    {uploadingVideo ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Video className="w-4 h-4 mr-2" />
                    )}
                    {uploadingVideo ? "Uploading..." : videoUrl ? "Replace Video" : "Upload Video"}
                  </Button>

                  {uploadingVideo && (
                    <Progress value={videoProgress} className="h-2 max-w-xs" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Display Name Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Display Name</CardTitle>
                <CardDescription>
                  This is how you'll be greeted in the app.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm">
                  <Label htmlFor="displayName" className="sr-only">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} className="btn-primary" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
