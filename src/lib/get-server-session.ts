import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from '~/lib/auth'

export const getServerSession = cache(async () => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  })

  return sessionData
})
