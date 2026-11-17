import {
  useRef,
  useState,
} from "react";

import {
  Check,
  FileImage,
  FileText,
  Upload,
  X,
} from "lucide-react";


type DocumentFormat =
  | "pdf"
  | "image";


type Props = {
  icon:
    React.ReactNode;

  title:
    string;

  description:
    string;

  documentPath:
    string | null;

  documentName:
    string | null;

  format:
    DocumentFormat;

  onUpload:
    (file: File) => Promise<void>;

  onClear:
    () => void;
};


const MAX_FILE_SIZE_BYTES =
  5 * 1024 * 1024;


const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


export function VehicleDocumentUploadCard({
  icon,
  title,
  description,
  documentPath,
  documentName,
  format,
  onUpload,
  onClear,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const [
    uploading,
    setUploading,
  ] =
    useState(
      false,
    );


  const [
    progress,
    setProgress,
  ] =
    useState(
      0,
    );


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  function validateFile(
    file:
      File,
  ): string | null {
    if (
      file.size >
      MAX_FILE_SIZE_BYTES
    ) {
      return "El archivo no puede superar los 5 MB.";
    }


    if (
      format ===
      "pdf"
    ) {
      if (
        file.type !==
        "application/pdf"
      ) {
        return "El documento debe ser un archivo PDF.";
      }

      return null;
    }


    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      return "El documento debe ser una imagen JPG, PNG o WebP.";
    }


    return null;
  }


  async function handleFile(
    file:
      File,
  ) {
    setError(
      null,
    );


    const validationError =
      validateFile(
        file,
      );


    if (
      validationError
    ) {
      setError(
        validationError,
      );

      return;
    }


    setUploading(
      true,
    );

    setProgress(
      15,
    );


    const timer =
      window.setInterval(
        () => {
          setProgress(
            (
              current,
            ) =>
              Math.min(
                current + 12,
                85,
              ),
          );
        },
        180,
      );


    try {
      await onUpload(
        file,
      );

      setProgress(
        100,
      );
    } catch (
      uploadError
    ) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el archivo. Intentá nuevamente.",
      );

      setProgress(
        0,
      );
    } finally {
      window.clearInterval(
        timer,
      );


      window.setTimeout(
        () => {
          setUploading(
            false,
          );

          setProgress(
            0,
          );
        },
        350,
      );
    }
  }


  function handleClear() {
    setError(
      null,
    );

    onClear();
  }


  const completed =
    Boolean(
      documentPath,
    ) &&
    !uploading;


  const accept =
    format === "pdf"
      ? "application/pdf,.pdf"
      : "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";


  const uploadLabel =
    format === "pdf"
      ? "Subir PDF"
      : "Subir imagen";


  return (
    <div
      className="relative rounded-[16px] p-5"
      style={{
        background:
          "#F2F1ED",
      }}
    >
      {completed && (
        <span
          className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
          style={{
            background:
              "#1D9E75",
          }}
        >
          <Check
            className="h-3.5 w-3.5 text-white"
            strokeWidth={
              3
            }
          />
        </span>
      )}


      <div className="flex flex-col items-center text-center">
        {icon}

        <p className="mt-2 text-[15px] font-semibold text-[#111110]">
          {title}
        </p>

        <p className="mt-1 text-[13px] text-[#6B6A66]">
          {description}
        </p>
      </div>


      <div className="mt-4">
        {completed &&
        documentName ? (
          <div className="flex items-center gap-2 rounded-[10px] bg-white px-3 py-2.5">
            {format ===
            "pdf" ? (
              <FileText className="h-4 w-4 text-[#1D9E75]" />
            ) : (
              <FileImage className="h-4 w-4 text-[#1D9E75]" />
            )}

            <span className="flex-1 truncate text-[13px] font-medium">
              {documentName}
            </span>

            <button
              type="button"
              onClick={
                handleClear
              }
              aria-label={`Quitar ${title}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F1ED]"
            >
              <X className="h-3.5 w-3.5 text-[#6B6A66]" />
            </button>
          </div>
        ) : uploading ? (
          <div className="rounded-[10px] bg-white px-3 py-2.5">
            <div className="flex items-center gap-2">
              {format ===
              "pdf" ? (
                <FileText className="h-4 w-4 text-[#1D9E75]" />
              ) : (
                <FileImage className="h-4 w-4 text-[#1D9E75]" />
              )}

              <span className="flex-1 text-[13px] font-medium">
                Subiendo…
              </span>

              <span className="text-[11px] font-semibold">
                {progress}%
              </span>
            </div>

            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#F2F1ED]">
              <div
                className="h-full transition-all"
                style={{
                  width:
                    `${progress}%`,

                  background:
                    "#1D9E75",
                }}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setError(
                null,
              );

              inputRef.current
                ?.click();
            }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-white text-[13px] font-semibold"
            style={{
              border:
                error
                  ? "1px solid #FCA5A5"
                  : "1px solid #E2E0D8",
            }}
          >
            <Upload className="h-4 w-4" />

            {uploadLabel}
          </button>
        )}


        <input
          ref={
            inputRef
          }
          type="file"
          accept={
            accept
          }
          className="hidden"
          onChange={(
            event,
          ) => {
            const file =
              event.target
                .files?.[0];


            if (
              file
            ) {
              void handleFile(
                file,
              );
            }


            event.target.value =
              "";
          }}
        />


        {error && (
          <div
            role="alert"
            className="mt-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2"
          >
            <p className="text-[12px] font-medium leading-[1.45] text-[#991B1B]">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}