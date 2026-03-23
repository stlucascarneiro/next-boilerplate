/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaRotate, FaTrash, FaUpload } from "react-icons/fa6";
import { PiImageSquareDuotone } from "react-icons/pi";
import Button from "./Button.client";
import Input from "./Input.client";

interface IImageInput {
  accept?: string;
  className?: string;
  label: string;
  maxSizeInMB?: number;
  name: string;
  onChange?: (file: File | null) => void;
  onError?: (message: string) => void;
  onUrlSubmit?: (url: string) => Promise<void> | void;
  placeholder?: string;
  required?: boolean;
  value?: File | null;
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/gif";
const DEFAULT_MAX_SIZE_MB = 5;

function parseAccept(accept: string) {
  return accept
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function isAcceptedFile(file: File, acceptedValues: string[]) {
  if (acceptedValues.length === 0) return true;

  const lowerName = file.name.toLowerCase();

  return acceptedValues.some((acceptedValue) => {
    if (acceptedValue.endsWith("/*")) {
      const prefix = acceptedValue.replace("/*", "");
      return file.type.toLowerCase().startsWith(`${prefix}/`);
    }

    if (acceptedValue.startsWith(".")) {
      return lowerName.endsWith(acceptedValue);
    }

    return file.type.toLowerCase() === acceptedValue;
  });
}

export default function ImageInput({
  accept = DEFAULT_ACCEPT,
  className,
  label,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  name,
  onChange,
  onError,
  onUrlSubmit,
  required,
  value,
}: IImageInput) {
  const [file, setFile] = useState<File | null>(() => value ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const acceptedValues = useMemo(() => parseAccept(accept), [accept]);
  const currentFile = value !== undefined ? value : file;

  useEffect(() => {
    const imageElement = previewImageRef.current;

    if (!imageElement) {
      return;
    }

    if (!currentFile) {
      imageElement.removeAttribute("src");
      return;
    }

    const objectUrl = URL.createObjectURL(currentFile);
    imageElement.src = objectUrl;

    return () => {
      console.log("revoking: ", objectUrl);
      URL.revokeObjectURL(objectUrl);
    };
  }, [currentFile]);

  function emitError(message: string) {
    setErrorMessage(message);
    onError?.(message);
  }

  function updateFile(nextFile: File | null) {
    setFile(nextFile);
    setErrorMessage(null);
    onChange?.(nextFile);
  }

  function validateAndSetFile(nextFile: File | null) {
    if (!nextFile) {
      updateFile(null);
      return;
    }

    if (!isAcceptedFile(nextFile, acceptedValues)) {
      emitError("Unsupported file format.");
      return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (nextFile.size > maxSizeInBytes) {
      emitError(`The selected file exceeds ${maxSizeInMB}MB.`);
      return;
    }

    updateFile(nextFile);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    validateAndSetFile(nextFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const nextFile = event.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(nextFile);
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFileDialog();
    }
  }

  function handleRemoveImage(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    updateFile(null);
  }

  function handleReplaceImage(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    openFileDialog();
  }

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <div>
        <label className="text-strong text-sm font-medium" htmlFor={name}>
          {label}
        </label>
      </div>

      {/* Image Preview Area */}
      <div
        className={`relative h-64 min-h-64 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition ${
          isDragging || isHovering
            ? "border-primary bg-primary/5"
            : "border-border-input bg-input"
        }`}
        onClick={openFileDialog}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="button"
        tabIndex={0}
      >
        {currentFile ? (
          <>
            <img
              alt={currentFile.name}
              className="h-full max-h-72 w-full object-cover"
              ref={previewImageRef}
            />
            {/* Overlay with Buttons */}
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 duration-300">
                <Button
                  icon={<FaRotate />}
                  onClick={(e) => handleReplaceImage(e)}
                  size="md"
                  variant="primary"
                >
                  Replace
                </Button>
                <Button
                  icon={<FaTrash />}
                  onClick={(e) => handleRemoveImage(e)}
                  size="md"
                  variant="danger"
                >
                  Remove
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
            <PiImageSquareDuotone className="text-primary text-4xl" />
            <div className="text-center">
              <p className="text-strong text-sm font-medium">
                No image selected
              </p>
              <p className="text-subtle text-sm">
                Upload an image or provide a URL
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        accept={accept}
        className="hidden"
        id={name}
        name={name}
        onChange={handleInputChange}
        ref={inputRef}
        required={required}
        type="file"
      />

      <div className="flex w-full gap-4">
        {/* Upload from Device Section */}
        <div className="flex-1">
          <p className="text-subtle mb-2 text-sm">Upload from device</p>
          <Button
            className="justify-center"
            icon={<FaUpload />}
            onClick={openFileDialog}
            size="lg"
            variant="secondary"
            width="full"
          >
            Choose File
          </Button>
        </div>

        {/* Or paste image URL Section */}
        <div className="flex-1">
          <p className="text-subtle mb-2 text-sm">Or paste image URL</p>
          <Input
            name={`${name}-url`}
            onChange={setUrlInput}
            onEnter={async () => {
              if (urlInput.trim()) {
                try {
                  await onUrlSubmit?.(urlInput.trim());
                  setUrlInput("");
                  setErrorMessage(null);
                } catch (error) {
                  emitError(
                    error instanceof Error
                      ? error.message
                      : "Could not import image from URL.",
                  );
                }
              }
            }}
            placeholder="https://example.com/image.jpg"
            type="url"
            value={urlInput}
          />
        </div>
      </div>

      {/* Helper Text / Recommendations */}
      {errorMessage && (
        <div className="flex">
          <p className="text-danger text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
