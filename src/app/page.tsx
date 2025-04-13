"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveAs } from 'file-saver';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Placeholder for actual image processing functions
const applyGrayscale = (imageData: ImageData, intensity: number): ImageData => imageData;
const applySepia = (imageData: ImageData, intensity: number): ImageData => imageData;
const applyInvert = (imageData: ImageData): ImageData => imageData;
const applyBrightness = (imageData: ImageData, intensity: number): ImageData => imageData;
const applyContrast = (imageData: ImageData, intensity: number): ImageData => imageData;
const applyBlur = (imageData: ImageData, intensity: number): ImageData => imageData;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function Home() {
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Filter states
    const [grayscale, setGrayscale] = useState(0);
    const [sepia, setSepia] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [blur, setBlur] = useState(0);
    const [hueRotate, setHueRotate] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [vignette, setVignette] = useState(0); // New filter
    const [invert, setInvert] = useState(false); // New filter

    // Export states
    const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png");
    const [exportQuality, setExportQuality] = useState(90); // JPEG/WebP quality


    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newImages = await Promise.all(
            Array.from(files).slice(0, 3).map(async (file) => {
                return await fileToBase64(file);
            })
        );

        setImages((prevImages) => [...prevImages, ...newImages].slice(0, 3));
    };

    const handleThumbnailClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    // Filter Handlers
    const handleGrayscaleChange = (value: number[]) => {
        setGrayscale(value[0]);
    };

    const handleSepiaChange = (value: number[]) => {
        setSepia(value[0]);
    };

    const handleBrightnessChange = (value: number[]) => {
        setBrightness(value[0]);
    };

    const handleContrastChange = (value: number[]) => {
        setContrast(value[0]);
    };

    const handleBlurChange = (value: number[]) => {
        setBlur(value[0]);
    };

    const handleHueRotateChange = (value: number[]) => {
        setHueRotate(value[0]);
    };

    const handleSaturationChange = (value: number[]) => {
        setSaturation(value[0]);
    };

    const handleVignetteChange = (value: number[]) => {
        setVignette(value[0]);
    };

    const handleInvertChange = (checked: boolean) => {
        setInvert(checked);
    };


    const handleClearImages = () => {
        setImages([]);
        setSelectedImage(null);
    };

    // Export Handlers
    const handleExportFormatChange = (format: "png" | "jpeg" | "webp") => {
        setExportFormat(format);
    };

    const handleExportQualityChange = (value: number[]) => {
        setExportQuality(value[0]);
    };


    const downloadImage = () => {
        if (!selectedImage) {
            alert("Please select an image to download.");
            return;
        }

        const canvas = document.createElement('canvas');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                alert("Could not create canvas context.");
                return;
            }

            // Apply filters
            let filterString = `grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur / 10}px) brightness(${brightness}%) contrast(${contrast}%) hue-rotate(${hueRotate}deg) saturate(${saturation}%)`;
            if (invert) {
                filterString += ' invert(1)';
            }
            ctx.filter = filterString;

            // Apply vignette (as a radial gradient)
            if (vignette > 0) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const outerRadius = Math.max(centerX, centerY);

                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, `rgba(0, 0, 0, ${vignette / 100})`);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }


            ctx.drawImage(img, 0, 0);

            // Convert to file
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `edited-image.${exportFormat}`, {
                        mimeType: `image/${exportFormat}`,
                        quality: exportFormat === 'png' ? undefined : exportQuality / 100, // Only for JPEG/WebP
                    });
                } else {
                    alert("Error creating the image file.");
                }
            }, `image/${exportFormat}`, exportFormat === 'png' ? 1 : exportQuality / 100);
        };

        img.onerror = () => {
            alert("Error loading the image.");
        };

        img.src = selectedImage;
    };


    const getFilterStyle = () => {
        let filterString = `grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur / 10}px) brightness(${brightness}%) contrast(${contrast}%) hue-rotate(${hueRotate}deg) saturate(${saturation}%)`;
        if (invert) {
            filterString += ' invert(1)';
        }
        return {
            filter: filterString,
        };
    };

    const getVignetteStyle = () => {
        if (vignette > 0 && selectedImage) {
            return {
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,${vignette / 100}) 100%)`,
                mixBlendMode: 'multiply',
            };
        }
        return {};
    };


  return (
    <div className="flex flex-col min-h-screen bg-background gap-4 p-4">
      <header className="sticky top-0 bg-secondary rounded-2xl p-4 shadow-md z-10">
        <h1 className="text-2xl font-bold text-primary-foreground">FilterForge</h1>
      </header>

      <main className="container mx-auto flex flex-col md:flex-row gap-4">
        {/* Image Upload and Preview Section */}
        <section className="md:w-1/3 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Upload up to three images for editing.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((imageSrc, index) => (
                  <button key={index} onClick={() => handleThumbnailClick(imageSrc)}>
                    <img
                      src={imageSrc}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                        selectedImage === imageSrc ? "ring-2 ring-accent" : ""
                      }`}
                    />
                  </button>
                ))}
                {images.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleClearImages}>
                    Clear Images
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Image Preview Section */}
        <section className="md:w-2/3 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
              <CardDescription>Preview the selected image with applied filters.</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedImage ? (
                  <div className="relative rounded-md overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                          <div className="relative w-full h-full">
                              <img
                                  src={selectedImage}
                                  alt="Selected Image"
                                  className="object-contain aspect-video"
                                  style={getFilterStyle()}
                              />
                              <div
                                  className="absolute top-0 left-0 w-full h-full"
                                  style={getVignetteStyle()}
                              ></div>
                          </div>
                      </AspectRatio>
                  </div>
              ) : (
                <Alert>
                  <Icons.help className="h-4 w-4" />
                  <AlertTitle>No image selected.</AlertTitle>
                  <AlertDescription>Please upload and select an image to start editing.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Filter Controls */}
      <section className="container mx-auto flex flex-col md:flex-row gap-4">
          <Card className="md:w-1/2">
              <Tabs defaultValue="filters1" className="w-full">
                  <CardHeader>
                      <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="filters1">Filters 1</TabsTrigger>
                          <TabsTrigger value="filters2">Filters 2</TabsTrigger>
                          <TabsTrigger value="export">Export</TabsTrigger>
                      </TabsList>
                      <CardDescription>Adjust filters and export settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <TabsContent value="filters1" className="grid gap-4">
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="grayscale">Grayscale ({grayscale}%)</Label>
                              <Slider
                                  id="grayscale"
                                  defaultValue={[0]}
                                  max={100}
                                  step={1}
                                  aria-label="Grayscale"
                                  value={[grayscale]}
                                  onValueChange={handleGrayscaleChange}
                              />
                          </div>
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="sepia">Sepia ({sepia}%)</Label>
                              <Slider
                                  id="sepia"
                                  defaultValue={[0]}
                                  max={100}
                                  step={1}
                                  aria-label="Sepia"
                                  value={[sepia]}
                                  onValueChange={handleSepiaChange}
                              />
                          </div>
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="brightness">Brightness ({brightness}%)</Label>
                              <Slider
                                  id="brightness"
                                  defaultValue={[100]}
                                  min={0}
                                  max={200}
                                  step={1}
                                  aria-label="Brightness"
                                  value={[brightness]}
                                  onValueChange={handleBrightnessChange}
                              />
                          </div>
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="contrast">Contrast ({contrast}%)</Label>
                              <Slider
                                  id="contrast"
                                  defaultValue={[100]}
                                  min={0}
                                  max={200}
                                  step={1}
                                  aria-label="Contrast"
                                  value={[contrast]}
                                  onValueChange={handleContrastChange}
                              />
                          </div>
                      </TabsContent>
                      <TabsContent value="filters2" className="grid gap-4">
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="blur">Blur ({blur}px)</Label>
                              <Slider
                                  id="blur"
                                  defaultValue={[0]}
                                  max={100}
                                  step={1}
                                  aria-label="Blur"
                                  value={[blur]}
                                  onValueChange={handleBlurChange}
                              />
                          </div>
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="hue-rotate">Hue Rotate ({hueRotate}deg)</Label>
                              <Slider
                                  id="hue-rotate"
                                  defaultValue={[0]}
                                  min={0}
                                  max={360}
                                  step={1}
                                  aria-label="Hue Rotate"
                                  value={[hueRotate]}
                                  onValueChange={handleHueRotateChange}
                              />
                          </div>
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="saturation">Saturation ({saturation}%)</Label>
                              <Slider
                                  id="saturation"
                                  defaultValue={[100]}
                                  min={0}
                                  max={200}
                                  step={1}
                                  aria-label="Saturation"
                                  value={[saturation]}
                                  onValueChange={handleSaturationChange}
                              />
                          </div>
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="vignette">Vignette ({vignette}%)</Label>
                              <Slider
                                  id="vignette"
                                  defaultValue={[0]}
                                  max={100}
                                  step={1}
                                  aria-label="Vignette"
                                  value={[vignette]}
                                  onValueChange={handleVignetteChange}
                              />
                          </div>
                          <div className="flex items-center space-x-2">
                              <Label htmlFor="invert">Invert</Label>
                              <Checkbox
                                  id="invert"
                                  checked={invert}
                                  onCheckedChange={handleInvertChange}
                              />
                          </div>
                      </TabsContent>
                      <TabsContent value="export" className="grid gap-4">
                          <div className="flex flex-col gap-2">
                              <Label htmlFor="export-format">Export Format</Label>
                              <Select onValueChange={handleExportFormatChange} defaultValue={exportFormat}>
                                  <SelectTrigger id="export-format">
                                      <SelectValue placeholder="Select format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="png">PNG</SelectItem>
                                      <SelectItem value="jpeg">JPEG</SelectItem>
                                      <SelectItem value="webp">WebP</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          {(exportFormat === "jpeg" || exportFormat === "webp") && (
                              <div className="flex flex-col gap-2">
                                  <Label htmlFor="export-quality">Quality ({exportQuality}%)</Label>
                                  <Slider
                                      id="export-quality"
                                      defaultValue={[exportQuality]}
                                      min={50}
                                      max={100}
                                      step={1}
                                      aria-label="Export Quality"
                                      value={[exportQuality]}
                                      onValueChange={handleExportQualityChange}
                                  />
                              </div>
                          )}

                          <Button onClick={downloadImage}>Download Image</Button>
                      </TabsContent>
                  </CardContent>
              </Tabs>
          </Card>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardTitle>Theme Overlays &amp; Export</CardTitle>
            <CardDescription>Apply theme overlays and export the image.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Theme Overlays will go here */}
            <p>Theme Overlays Coming Soon!</p>

                        {/* Export Settings */}


                        {/* Quality Setting (for JPEG/WebP) */}


                        {/* Download Button */}
          </CardContent>
        </Card>
      </section>

      <footer className="sticky bottom-0 bg-secondary rounded-2xl p-4 shadow-md z-10">
        <p className="text-center text-primary-foreground">
          &copy; {new Date().getFullYear()} FilterForge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
