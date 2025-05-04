import { Suspense } from 'react';
import { AlertCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyInputForm } from '@/components/emergency-input-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function Home() {
  // Placeholder: Check if setup is complete (e.g., from local storage or user state)
  const isSetupComplete = false; // Replace with actual logic

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">Lifeline AI</h1>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center">
        {!isSetupComplete && (
          <Alert variant="default" className="mb-6 w-full max-w-2xl bg-primary/10 border-primary/30">
            <UserPlus className="h-4 w-4" />
            <AlertTitle className="font-semibold">Complete Your Profile</AlertTitle>
            <AlertDescription>
              Please set up your emergency contacts and medical history for a faster response in critical situations.
              <Link href="/setup" passHref>
                 <Button variant="link" className="p-0 h-auto ml-1 text-primary">Go to Setup</Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Card className="w-full max-w-2xl shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">Emergency Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-center text-muted-foreground">Loading form...</p>}>
              <EmergencyInputForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Extreme Emergency Button - placed lower for potential easier reach */}
        <div className="mt-8 w-full max-w-xs">
           <Button variant="destructive" size="lg" className="w-full py-6 text-lg font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Extreme Emergency
           </Button>
           <p className="text-xs text-center mt-2 text-muted-foreground">Sends location & medical info to contacts & hospitals.</p>
        </div>

      </main>

      <footer className="bg-secondary text-muted-foreground p-4 text-center text-sm border-t">
        © {new Date().getFullYear()} Lifeline AI. All rights reserved.
      </footer>
    </div>
  );
}
