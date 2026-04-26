import LoginPageComponent from './LoginPageComponent'

export default async function AdminSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  
  // We can pre-fill based on the slug if we want, or just let them type it.
  // Pre-fill the username as the slug
  const defaultEmail = slug
  const defaultPassword = `${slug}123`

  return <LoginPageComponent slug={slug} defaultEmail={defaultEmail} defaultPassword={defaultPassword} />
}
