import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Settings, MessageSquare, BarChart3 } from 'lucide-react'

export function AdminQuickActions() {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <CardHeader>
        <CardTitle className="text-white">Быстрые действия</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button asChild variant="secondary" className="h-20 flex-col">
            <Link href="/dealer/add-car">
              <Plus className="h-6 w-6 mb-2" />
              Добавить авто
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-20 flex-col">
            <Link href="/dealer?tab=leads">
              <MessageSquare className="h-6 w-6 mb-2" />
              Заявки
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-20 flex-col">
            <Link href="/dealer?tab=my-cars">
              <BarChart3 className="h-6 w-6 mb-2" />
              Мои авто
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-20 flex-col">
            <Link href="/dealer?tab=settings">
              <Settings className="h-6 w-6 mb-2" />
              Настройки
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
