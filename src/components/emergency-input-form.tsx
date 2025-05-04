"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Image as ImageIcon, Send, FileText, Languages, Volume2, AlertCircle, Thermometer } from 'lucide-react'; // Added Thermometer for severity
import { imageAidedDiagnosis } from '@/ai/flows/image-aided-diagnosis';
import { emergencyResponseOffline } from '@/ai/flows/emergency-response-offline';
import { localizeEmergencyAdvice } from '@/ai/flows/localize-emergency-advice';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils"; // Import cn utility

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  inputType: z.enum(['text', 'voice', 'image']),
  textDescription: z.string().optional(),
  imageFile: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  language: z.string().default('en'), // Default language English
});

type FormValues = z.infer<typeof formSchema>;

// Placeholder for Text-to-Speech functionality
const speak = (text: string, lang: string = 'en') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang; // Set the language for speech synthesis
          window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Speech synthesis failed:", error);
            // Optionally show a toast message to the user
        }
    } else {
        console.warn("Speech synthesis not supported in this browser.");
        // Optionally show a toast message to the user
    }
};


export function EmergencyInputForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Updated result state to include severity
  const [result, setResult] = useState<{ diagnosis?: string; firstAidInstructions: string; severity?: string } | null>(null);
  const [selectedTab, setSelectedTab] = useState<'text' | 'voice' | 'image'>('text');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false); // State for voice input
  const [language, setLanguage] = useState('en'); // Default to English
  const [progress, setProgress] = useState(0); // Progress for AI processing


  // Effect to handle browser-specific APIs after hydration
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = language; // Use selected language
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            setSpeechRecognition(recognition);
          } else {
            console.warn("Speech Recognition not supported in this browser.");
          }
      }
  }, [language]); // Re-initialize if language changes

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputType: 'text',
      textDescription: '',
      language: 'en',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Manually set the value and trigger validation for the file input
      form.setValue('imageFile', files, { shouldValidate: true });
    } else {
      setPreviewImage(null);
      form.setValue('imageFile', undefined, { shouldValidate: true });
    }
  };

  const startListening = () => {
    if (speechRecognition) {
        setIsListening(true);
        setResult(null); // Clear previous results
        speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            form.setValue('textDescription', transcript); // Set transcript to text area
            setSelectedTab('text'); // Switch tab to text to show the transcript
            setIsListening(false);
            // Optionally submit automatically or wait for user confirmation
            // onSubmit({ inputType: 'text', textDescription: transcript, language });
        };
        speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            toast({
                title: "Voice Input Error",
                description: `Could not recognize speech. Error: ${event.error}`,
                variant: "destructive",
            });
            setIsListening(false);
        };
        speechRecognition.onend = () => {
            setIsListening(false); // Ensure listening state is reset
        };
        try {
            speechRecognition.start();
        } catch (e) {
            console.error("Could not start speech recognition:", e);
             toast({
                title: "Voice Input Error",
                description: "Could not start voice recognition. Please check permissions.",
                variant: "destructive",
            });
            setIsListening(false);
        }
    } else {
         toast({
            title: "Voice Input Not Supported",
            description: "Your browser does not support voice input.",
            variant: "destructive",
        });
    }
  };

  const stopListening = () => {
      if (speechRecognition && isListening) {
          speechRecognition.stop();
          setIsListening(false);
      }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    setProgress(10); // Start progress

    // Acknowledge Python code integration limitation
    if (selectedTab === 'image') {
        console.info("Note: Direct Python ML model integration is complex in this environment. Using Genkit flow to simulate image analysis including severity estimation.");
    }


    try {
      // Updated response type to include severity
      let response: { diagnosis?: string; firstAidInstructions: string; severity?: string } | null = null;
      let userInput = values.textDescription || '';
      const targetLanguage = values.language || 'en';

       setProgress(30);

      if (selectedTab === 'image' && values.imageFile && values.imageFile.length > 0) {
        const file = values.imageFile[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const imageDataUri = reader.result as string;
          try {
            // Call the updated imageAidedDiagnosis flow
            const diagnosisResult = await imageAidedDiagnosis({
              imageDataUri,
              description: values.textDescription || 'Analyze the injury in the image', // Provide context
            });
             setProgress(70);
             response = diagnosisResult;
             userInput = values.textDescription || diagnosisResult.diagnosis || 'Injury described in image'; // Use diagnosis as input if text is empty
             finalizeResponse(response, userInput, targetLanguage);
          } catch (aiError) {
             handleAiError(aiError);
          }
        };
        reader.onerror = (error) => {
           handleAiError(error, "Error reading image file.");
        };

      } else if (selectedTab === 'text' || selectedTab === 'voice') {
          if (!values.textDescription) {
              toast({ title: "Input Required", description: "Please describe the emergency.", variant: "destructive" });
              setIsLoading(false);
              setProgress(0);
              return;
          }
          // Use offline model first (simulated)
          try {
             const offlineResult = await emergencyResponseOffline({
                 emergencyDescription: values.textDescription,
             });
             setProgress(70);
             // Offline model doesn't provide severity in this simulation
             response = { ...offlineResult, severity: 'Unknown (Offline Mode)' };
             userInput = values.textDescription;
             finalizeResponse(response, userInput, targetLanguage);

          } catch (offlineError) {
             // Fallback to cloud LLM if offline fails or if needed (simulation)
             console.warn("Offline AI failed, trying cloud AI:", offlineError);
             toast({ title: "Offline Mode Failed", description: "Trying online assistance...", variant: "default"});
             // Simulate calling a cloud flow that might provide severity (using image flow for simulation)
             try {
                // Re-using image flow's prompt style for severity estimation via text
                const cloudResult = await imageAidedDiagnosis({
                    imageDataUri: '', // No image, rely on description
                    description: values.textDescription
                });

                setProgress(70);
                response = cloudResult; // Cloud result includes severity
                userInput = values.textDescription;
                finalizeResponse(response, userInput, targetLanguage);
             } catch (cloudError) {
                 handleAiError(cloudError);
             }
          }
      } else {
         toast({ title: "Invalid Input", description: "Please select an input method and provide details.", variant: "destructive" });
         setIsLoading(false);
         setProgress(0);
      }

    } catch (error) {
       handleAiError(error);
    }
  };

  const finalizeResponse = async (
      response: { diagnosis?: string; firstAidInstructions: string; severity?: string } | null, // Include severity
      userInput: string,
      targetLanguage: string
      ) => {
       if (response) {
          if (targetLanguage !== 'en') { // Translate if not English
              try {
                  // Translate only the advice, keep diagnosis/severity standard for now
                  const localizationResult = await localizeEmergencyAdvice({
                      userInput: userInput, // Send original user input for potential translation context
                      advice: response.firstAidInstructions,
                      language: targetLanguage,
                  });
                  setProgress(90);
                  setResult({
                      diagnosis: response.diagnosis,
                      firstAidInstructions: localizationResult.translatedAdvice,
                      severity: response.severity, // Keep severity as is
                  });
                  toast({ title: "Success", description: "Received translated first aid advice." });
              } catch (translationError) {
                  console.error("Translation failed:", translationError);
                  toast({ title: "Translation Error", description: "Could not translate advice. Showing in English.", variant: "destructive" });
                  setResult(response); // Show original English advice
              }
          } else {
              setProgress(90);
              setResult(response);
              toast({ title: "Success", description: "Received first aid advice." });
          }
      }
      setIsLoading(false);
      setProgress(100);
      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 1500);
  };


  const handleAiError = (error: any, customMessage?: string) => {
      console.error("AI processing error:", error);
      toast({
          title: "AI Error",
          description: customMessage || "Could not get AI assistance. Please try again or use the Extreme Emergency button if needed.",
          variant: "destructive",
      });
      setIsLoading(false);
      setProgress(0);
  };

  // Helper to get severity color
  const getSeverityColor = (severity?: string): string => {
      if (!severity) return 'text-muted-foreground'; // Default
      const lowerSeverity = severity.toLowerCase();
      if (lowerSeverity.includes('critical') || lowerSeverity.includes('severe')) return 'text-destructive';
      if (lowerSeverity.includes('moderate')) return 'text-yellow-600 dark:text-yellow-400'; // Using Tailwind yellow
      if (lowerSeverity.includes('minor') || lowerSeverity.includes('low')) return 'text-green-600 dark:text-green-400'; // Using Tailwind green
      return 'text-muted-foreground';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'text' | 'voice' | 'image')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="text"><FileText className="h-4 w-4 mr-1 inline-block"/> Text</TabsTrigger>
            <TabsTrigger value="voice"><Mic className="h-4 w-4 mr-1 inline-block"/> Voice</TabsTrigger>
            <TabsTrigger value="image"><ImageIcon className="h-4 w-4 mr-1 inline-block"/> Image</TabsTrigger>
          </TabsList>

          {/* Language Selection */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="flex items-center"><Languages className="h-4 w-4 mr-1"/> Language</FormLabel>
                <FormControl>
                   <select
                      {...field}
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                         "appearance-none" // Remove default arrow in some browsers
                      )}
                      onChange={(e) => {
                          field.onChange(e);
                          setLanguage(e.target.value); // Update language state for TTS/STT
                      }}
                    >
                    <option value="en">English</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                     <option value="de">Deutsch (German)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    {/* Add more languages as needed */}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <TabsContent value="text">
            <FormField
              control={form.control}
              name="textDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe the emergency</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Deep cut on left arm, bleeding heavily', 'Person is unconscious and not breathing'"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="voice" className="flex flex-col items-center space-y-4">
             <p className="text-sm text-muted-foreground">Press the button and speak clearly.</p>
             <Button
               type="button"
               variant={isListening ? "destructive" : "outline"}
               size="lg"
               className="rounded-full w-24 h-24 flex flex-col items-center justify-center"
               onClick={isListening ? stopListening : startListening}
               disabled={!speechRecognition || isLoading}
             >
                <Mic className={`h-10 w-10 ${isListening ? 'animate-pulse text-red-500' : ''}`}/>
                <span className="mt-1 text-xs">{isListening ? 'Listening...' : 'Tap to Speak'}</span>
             </Button>
             {!speechRecognition && <p className="text-xs text-destructive">Voice input not available on this browser.</p>}
              {/* Display transcript in text area */}
              <FormField
                control={form.control}
                name="textDescription"
                render={({ field }) => (
                    <FormItem className="w-full hidden"> {/* Hidden but holds the value */}
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                )}
               />
          </TabsContent>

          <TabsContent value="image">
            <div className="space-y-4">
               {/* Optional Text Description for Image */}
                <FormField
                  control={form.control}
                  name="textDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optional: Add context for the image</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'What is this rash?', 'How bad is this burn? Describe visible bleeding, depth, color changes.'"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="imageUpload">Upload an image of the injury</FormLabel>
                    <FormControl>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                    <FormDescription>Max 5MB. JPG, PNG, WEBP supported.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {previewImage && (
                <div className="mt-4 relative w-full h-48 overflow-hidden rounded-md border">
                  <Image
                    src={previewImage}
                    alt="Image preview"
                    layout="fill"
                    objectFit="contain"
                    data-ai-hint="injury preview"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isLoading} className="w-full">
          <Send className="h-4 w-4 mr-2"/>
          {isLoading ? 'Analyzing...' : 'Get First Aid Advice'}
        </Button>

        {isLoading && <Progress value={progress} className="w-full" />}

        {result && (
          <Card className="mt-6 bg-secondary border-primary/30">
             <CardHeader className="pb-2 space-y-1">
                {result.diagnosis && <CardTitle className="text-lg">Possible Diagnosis:</CardTitle>}
                {result.diagnosis && <p className="text-md font-medium">{result.diagnosis}</p>}
                 {/* Display Severity */}
                {result.severity && (
                    <div className="flex items-center pt-2">
                        <Thermometer className={`h-5 w-5 mr-1.5 ${getSeverityColor(result.severity)}`} />
                        <p className={`text-md font-semibold ${getSeverityColor(result.severity)}`}>
                            Severity: {result.severity}
                        </p>
                    </div>
                )}
              </CardHeader>
            <CardContent className="space-y-2">
                <h3 className="text-lg font-semibold mt-2">First Aid Instructions:</h3>
                {/* Use prose-invert for dark mode compatibility */}
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{result.firstAidInstructions}</div>
            </CardContent>
            <CardFooter className="flex justify-end">
               <Button variant="ghost" size="sm" onClick={() => speak(result.firstAidInstructions, language)}>
                  <Volume2 className="h-4 w-4 mr-1"/> Listen
               </Button>
            </CardFooter>
             <Alert variant="destructive" className="mt-4 mx-4 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                  This AI advice is for informational purposes only and not a substitute for professional medical help. Call emergency services if needed. Severity estimation is experimental.
                </AlertDescription>
            </Alert>
          </Card>
        )}
      </form>
    </Form>
  );
}
