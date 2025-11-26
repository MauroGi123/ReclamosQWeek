"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { checkAndRegister } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verificando...
        </>
      ) : (
        "Comenzar a Jugar"
      )}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(checkAndRegister, null);

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Nombre</Label>
        <Input id="firstName" name="firstName" placeholder="Tu nombre" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Apellido</Label>
        <Input id="lastName" name="lastName" placeholder="Tu apellido" required />
      </div>
      
      {state?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
