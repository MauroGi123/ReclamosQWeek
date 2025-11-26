import { AppHeader } from "@/components/layout/AppHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAdminResults } from "@/lib/actions";

export default async function AdminPage() {
    const results = await getAdminResults();

    return (
        <>
            <AppHeader />
            <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
                <AdminDashboard initialResults={results} />
            </main>
        </>
    );
}

// Force dynamic rendering to get fresh data on each visit.
export const dynamic = 'force-dynamic';
