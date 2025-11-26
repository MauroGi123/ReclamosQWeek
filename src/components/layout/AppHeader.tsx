import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="QWeek Reclamos de Clientes - Página de inicio">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">QWeek Reclamos de Clientes</span>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
