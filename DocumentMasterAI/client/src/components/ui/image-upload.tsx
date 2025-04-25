import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileType, X, Image, File, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function ImageUpload({ 
  onUpload, 
  accept = "image/*,application/dicom,.dcm,.nii,.nii.gz", 
  maxSize = 25, 
  className 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [onUpload, maxSize]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, [onUpload, maxSize]);

  const processFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Check file type
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    setFileName(file.name);
    setFileType(file.type || fileExt || "unknown");

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onUpload(file);
    setIsUploaded(true);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setPreview(null);
    setFileName(null);
    setFileType(null);
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (preview) return null;
    
    if (!fileType) return <Upload className="h-16 w-16 text-muted-foreground/50" />;
    
    if (fileType.startsWith("image/")) {
      return <Image className="h-16 w-16 text-muted-foreground/70" />;
    } else if (fileType.includes("dicom") || fileType === "dcm") {
      return <FileType className="h-16 w-16 text-primary/70" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-16 w-16 text-destructive/70" />;
    } else {
      return <File className="h-16 w-16 text-muted-foreground/70" />;
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-0 overflow-hidden">
        <div
          className={cn(
            "file-drop-zone flex flex-col items-center justify-center min-h-[200px] cursor-pointer",
            isDragging && "active",
            isUploaded ? "border-success/50" : "border-border"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={isUploaded ? undefined : handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
          />
          
          {isUploaded && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-[300px] w-auto object-contain rounded-md"
            />
          ) : (
            <>
              {getFileIcon()}
              
              {fileName ? (
                <div className="mt-4 text-center">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    {isUploaded && <Check className="h-4 w-4 text-success" />}
                    {fileName}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isUploaded ? "File uploaded successfully" : "Processing..."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground mb-1">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supported formats: DICOM, NIfTI, JPG, PNG, PDF</p>
                  <Button className="mt-4" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
