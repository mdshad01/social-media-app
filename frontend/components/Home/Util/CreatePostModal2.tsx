import LoadingButton from "@/components/Helper/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { addPost } from "@/store/postSlice";
import { User } from "@/type";
import axios from "axios";
import { ImageIcon, Video, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const CreatePostModal2 = ({ isOpen, onClose, user }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setCaption("");
    setShowPoll(false);
    setShowEvent(false);
    setPollOptions(["", ""]);
    setEventData({ title: "", date: "", time: "", location: "" });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
        toast.error("Please select a valid image or video file!");
        return;
      }

      // ✅ Update size limits
      const maxSize = file.type.startsWith("video")
        ? 30 * 1024 * 1024
        : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          `File size should not exceed ${
            file.type.startsWith("video") ? "30MB" : "10MB"
          }!`
        );
        return;
      }

      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
      setFileType(file.type.startsWith("image") ? "image" : "video");
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleCreatePost = async () => {
    // Validation
    if (!caption.trim() && !selectedFile && !showPoll && !showEvent) {
      toast.error("Please add some content to your post!");
      return;
    }

    if (showPoll) {
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        toast.error("Poll must have at least 2 options!");
        return;
      }
    }

    if (showEvent && (!eventData.title || !eventData.date)) {
      toast.error("Event must have a title and date!");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);

    // Determine post type
    let postType = "text";

    if (selectedFile) {
      if (fileType === "image") {
        postType = "image";
        formData.append("image", selectedFile);
      } else if (fileType === "video") {
        postType = "video";
        formData.append("image", selectedFile); // Backend uses same field name
      }
    }

    if (showPoll) {
      postType = "poll";
      const validOptions = pollOptions.filter((opt) => opt.trim());
      formData.append(
        "pollData",
        JSON.stringify({
          question: caption,
          options: validOptions,
        })
      );
    }

    if (showEvent) {
      postType = "event";
      formData.append("eventData", JSON.stringify(eventData));
    }

    formData.append("postType", postType);

    const createPostReq = async () =>
      await axios.post(`${BASE_API_URL}/posts/create-post`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setUploadProgress(percentCompleted);
        },
      });

    const result = await handleAuthRequest(createPostReq, setIsLoading);

    if (result) {
      dispatch(addPost(result.data.data.post));
      toast.success("Post created successfully");
      resetForm();
      setUploadProgress(0);
      onClose();
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {previewUrl || showPoll || showEvent ? (
          <div className="flex flex-col space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center">Create Post</DialogTitle>
            </DialogHeader>
            {isLoading && fileType === "video" && (
              <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Uploading video... {uploadProgress}%
                </p>
              </div>
            )}

            {/* File Preview */}
            {previewUrl && (
              <div className="relative">
                {fileType === "video" ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-96 rounded-md object-contain"
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="w-full max-h-96 rounded-md object-contain"
                  />
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setFileType(null);
                  }}
                  className="absolute top-2 right-2 bg-card rounded-full p-1 shadow-md hover:bg-card"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Poll Options */}
            {showPoll && (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Poll Options</p>
                  <button
                    onClick={() => setShowPoll(false)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Poll
                  </button>
                </div>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 border border-border bg-background rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => removePollOption(index)}
                        className="text-red-500 hover:text-red-700 w-8"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button
                    onClick={addPollOption}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    + Add option
                  </button>
                )}
              </div>
            )}

            {/* Event Form */}
            {showEvent && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Event Details</p>
                  <button
                    onClick={() => setShowEvent(false)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Event
                  </button>
                </div>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  placeholder="Event title"
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) =>
                      setEventData({ ...eventData, date: e.target.value })
                    }
                    className="border border-border bg-background rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="time"
                    value={eventData.time}
                    onChange={(e) =>
                      setEventData({ ...eventData, time: e.target.value })
                    }
                    className="border border-border bg-background rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) =>
                    setEventData({ ...eventData, location: e.target.value })
                  }
                  placeholder="Location"
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Caption Input */}
            <textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-border rounded-lg p-3 text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[100px] resize-none"
            />

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <LoadingButton
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                isLoading={isLoading}
                onClick={handleCreatePost}
              >
                Create Post
              </LoadingButton>
              <button
                className="bg-secondary text-foreground hover:bg-accent px-6 py-2 rounded-md transition-colors"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Initial View
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Create Post</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
              {/* Caption Input */}
              <textarea
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-border rounded-lg p-3 text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[100px] resize-none"
              />

              {/* Add Options */}
              <div className="w-full border-t pt-4">
                <p className="text-sm font-semibold mb-3 text-left">
                  Add to your post
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleButtonClick}
                    className="flex items-center gap-2 justify-center"
                  >
                    <ImageIcon size={20} />
                    Photo/Video
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPoll(true)}
                    className="flex items-center gap-2 justify-center"
                  >
                    <Image src="/poll.png" alt="" width={20} height={20} />
                    Poll
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEvent(true)}
                    className="flex items-center gap-2 justify-center col-span-2"
                  >
                    <Image src="/addevent.png" alt="" width={20} height={20} />
                    Event
                  </Button>
                </div>
              </div>

              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {/* Post Button */}
              <LoadingButton
                className="w-full bg-primary text-white hover:bg-primary/90"
                isLoading={isLoading}
                onClick={handleCreatePost}
                disabled={!caption.trim()}
              >
                Post
              </LoadingButton>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal2;
