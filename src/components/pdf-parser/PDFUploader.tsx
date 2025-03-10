import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Job } from "@/types/job";

interface PDFUploaderProps {
  onExtractedData?: (data: Partial<Job>) => void;
}

export default function PDFUploader({ onExtractedData }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionStatus, setExtractionStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setExtractionStatus("idle");
      setErrorMessage("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setExtractionStatus("idle");
      setErrorMessage("");
    } else {
      setErrorMessage("Please upload a PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const simulateExtraction = () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setExtractionStatus("processing");

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate extraction process
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);
      setExtractionStatus("success");

      // Create empty extracted data object
      const mockExtractedData: Partial<Job> = {};

      if (onExtractedData) {
        onExtractedData(mockExtractedData);
      }
    }, 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Job Ticket</CardTitle>
        <CardDescription>
          Upload a PDF job ticket to automatically extract information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 cursor-pointer transition-colors ${
            isUploading ? "pointer-events-none opacity-70" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("pdf-upload")?.click()}
        >
          {!file && !isUploading && (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse files
              </p>
            </>
          )}

          {file && !isUploading && (
            <>
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          )}

          {isUploading && (
            <>
              <div className="mb-2">
                <Progress value={uploadProgress} className="h-2 w-full" />
              </div>
              <p className="text-sm font-medium">Processing PDF...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Extracting job information
              </p>
            </>
          )}

          <input
            type="file"
            id="pdf-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {extractionStatus === "success" && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Job information extracted successfully
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Supported file: PDF (max 10MB)
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {file && extractionStatus !== "success" && (
          <Button onClick={simulateExtraction} disabled={isUploading || !file}>
            Extract Information
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
