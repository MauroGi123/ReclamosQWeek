"use client";

import { useState, useEffect } from "react";
import type { Participant } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, AlertCircle } from "lucide-react";
import { deleteResult } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminDashboardProps {
  initialResults: Participant[];
}

function ClientFormattedDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This will run only on the client, after hydration
    setFormattedDate(new Date(dateString).toLocaleString('es-ES'));
  }, [dateString]);

  // Render a placeholder on the server and initial client render
  if (!formattedDate) {
    return null;
  }

  return <>{formattedDate}</>;
}

export function AdminDashboard({ initialResults }: AdminDashboardProps) {
  const [results, setResults] = useState(initialResults);
  const { toast } = useToast();

  const handleDownload = async () => {
    // This is a simple way to trigger a download from a server action
    // that returns a Response object.
    window.location.href = '/api/download-results';
  };
  
  const handleDelete = async (id: string) => {
    const res = await deleteResult(id);
    if (res.success) {
      setResults(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Éxito",
        description: "Participación eliminada correctamente.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message || "No se pudo eliminar la participación.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Panel de Administrador</CardTitle>
          <CardDescription>Resultados de los participantes del juego.</CardDescription>
        </div>
        <Button onClick={handleDownload} className="mt-4 md:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Descargar Excel (CSV)
        </Button>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead className="text-center">Calificación</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.firstName}</TableCell>
                    <TableCell>{p.lastName}</TableCell>
                    <TableCell className="text-center">
                      {`${((p.score / p.total) * 100).toFixed(0)}% (${p.score}/${p.total})`}
                    </TableCell>
                    <TableCell>
                      <ClientFormattedDate dateString={p.createdAt} />
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Eliminar participación de ${p.firstName}`}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la participación de {p.firstName} {p.lastName}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <AlertCircle className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">Aún no hay participaciones</p>
            <p className="text-sm">Los resultados aparecerán aquí cuando los usuarios completen el juego.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
