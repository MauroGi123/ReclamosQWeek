import { AppHeader } from "@/components/layout/AppHeader";
import { LoginForm } from "@/components/game/LoginForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">¡Bienvenido!</CardTitle>
            <CardDescription>Ingresa tus datos para comenzar el desafío.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
