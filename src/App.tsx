import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import ConversationalOnboarding from './components/ConversationalOnboarding'
import Dashboard from './components/Dashboard'

export interface UserProfile {
  skills: string[]
  goals: string
  coachingFrequency: 'weekly' | 'biweekly' | 'monthly'
  timePerWeek: number
  hasSpecialNeeds: boolean
  specialNeeds: string
  learningStyle: string
}

function App() {
  const [userProfile, setUserProfile] = useKV<UserProfile | null>('user-profile', null)
  const [onboardingComplete, setOnboardingComplete] = useKV('onboarding-complete', false)

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setOnboardingComplete(true)
  }

  if (!onboardingComplete || !userProfile) {
    return <ConversationalOnboarding onComplete={handleOnboardingComplete} />
  }

  return <Dashboard userProfile={userProfile} />
}

export default App