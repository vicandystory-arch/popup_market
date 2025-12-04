import { StoreForm } from '@/components/stores/StoreForm'

export function NewStorePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">새 스토어 등록</h1>
      <StoreForm />
    </div>
  )
}



