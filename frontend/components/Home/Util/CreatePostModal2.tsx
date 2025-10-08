import LoadingButton from "@/components/Helper/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { addPost } from "@/store/postSlice";
import { User } from "@/type";
import axios from "axios";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  //   initialMediaType: "photo" | "video" | "poll" | "event" | null;
  user: User;
}

const CreatePostModal2 = ({ isOpen, onClose, user }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setPreviewImage(null);
      setCaption("");
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // validate file type
      if (!file.type.startsWith("image")) {
        toast.error("Please select a valid image file!");
        return;
      }
      // valid image size
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size shound not exceed 10MB!");
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewImage(imageUrl);
    }
  };
  const handleCreatePost = async () => {
    if (!selectedImage) toast.error("Please select an image to create a post!");

    const formData = new FormData();
    formData.append("caption", caption);

    if (selectedImage) formData.append("image", selectedImage);

    const createPostReq = async () =>
      await axios.post(`${BASE_API_URL}/posts/create-post`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

    const result = await handleAuthRequest(createPostReq, setIsLoading);

    if (result) {
      dispatch(addPost(result.data.data.post));
      toast.success("Post created successfully");
      setPreviewImage(null);
      setCaption("");
      setSelectedImage(null);
      onClose();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {previewImage ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="mt-4">
              <Image
                src={previewImage}
                alt="Image"
                width={400}
                height={400}
                className="overflow-auto object-contain max-h-96 rounded-md w-full"
              />
            </div>
            <input
              placeholder="What on your mind?"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-4 border rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 p-2"
            />
            <div className="flex space-x-4 mt-4">
              <LoadingButton
                className="bg-blue-600 text-white hover:bg-blue-700"
                isLoading={isLoading}
                onClick={handleCreatePost}>
                Create Post
              </LoadingButton>
              <button
                className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-1 rounded-md"
                onClick={() => {
                  setCaption("");
                  setSelectedImage(null);
                  setPreviewImage(null);
                  onClose();
                }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Shoe the default view
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Upload Image</DialogTitle>
              <div className="flex flex-col items-center justify-center text-center gap-4 space-x-4">
                <div className="flex space-x-2 text-gray-600 mt-4">
                  <ImageIcon size={40} />
                </div>
                <p>Select a photo from your computer</p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleButtonClick}>
                  Select from computer
                </Button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal2;
