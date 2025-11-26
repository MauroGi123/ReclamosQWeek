import { AppHeader } from "@/components/layout/AppHeader";
import { GameController } from "@/components/game/GameController";
import { Suspense } from "react";

function GamePageContent() {
    return (
        <>
            <AppHeader />
            <main className="flex-grow flex items-start justify-center p-4 sm:p-6 md:p-8">
                <GameController />
            </main>
        </>
    );
}

export default function PlayPage() {
    return (
        <Suspense fallback={<div className="flex-grow flex items-center justify-center">Cargando...</div>}>
            <GamePageContent />
        </Suspense>
    );
}
