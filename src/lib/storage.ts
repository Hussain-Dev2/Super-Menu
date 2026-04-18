import { createClient } from '@/utils/supabase/client'

export async function uploadRestaurantImage(file: File): Promise<string | null> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from('restaurant-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: publicUrlData } = supabase.storage
    .from('restaurant-assets')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
