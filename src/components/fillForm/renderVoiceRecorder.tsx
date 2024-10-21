import { FormItemDetails } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { FormState } from "./fillForm";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderVoiceRecorder({
  itemD,
  formState,
  setFormState,
}: Props) {
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (
      (formState[itemD.newTitle] as Blob[]) &&
      (formState[itemD.newTitle] as Blob[]).length > 0
    ) {
      setRecordedChunks(formState[itemD.newTitle] as Blob[]);
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl);
    }
  }, [formState, itemD.newTitle]);
  useEffect(() => {
    setRecordedChunks([]);
  }, [audioUrl]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      setIsRecording(true);
      mediaRecorderRef.current.start(1000);
      mediaRecorderRef.current.ondataavailable = (e) => {
        setRecordedChunks((prevChunks) => [...prevChunks, e.data]);
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setFormState({ ...formState, [itemD.newTitle]: recordedChunks });
  };

  return (
    <div className="w-full flex flex-col items-start justify-start space-y-2">
      <p
        className={`w-full text-${itemD.newColor} ${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        }`}
      >
        {itemD.newTitle} :
      </p>
      <div className="w-full flex items-center justify-start space-x-2">
        <button
          type="button"
          onClick={startRecording}
          disabled={isRecording}
          className={`p-2 rounded-lg text-white bg-green-500 disabled:bg-green-200`}
        >
          Record
        </button>
        <button
          type="button"
          onClick={stopRecording}
          disabled={!isRecording}
          className={`p-2 rounded-lg text-white bg-red-500 disabled:bg-red-200`}
        >
          Stop
        </button>
        {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
      </div>
    </div>
  );
}
