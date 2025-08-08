import { ProtectedRoute } from '@/components/protected-route'
import { DealerHeader } from '@/components/dealer-header'

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DealerHeader />
        {children}
      </div>
    </ProtectedRoute>
  )
}
