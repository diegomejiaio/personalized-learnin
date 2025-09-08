import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { GraduationCap, Target, Clock, Users, CheckCircle, ArrowRight, Play, User, Circle, ArrowCounterClockwise } from '@phosphor-icons/react'
import { UserProfile } from '../App'
import LearningPath from './LearningPath'
import Assessments from './Assessments'
import ShadowOpportunities from './ShadowOpportunities'
import MentorshipPanel from './MentorshipPanel'
import Chat from './Chat'
import FloatingAICoach from './FloatingAICoach'

interface DashboardProps {
  userProfile: UserProfile
  onResetSetup: () => void
}

interface LearningProgress {
  completedModules: number
  totalModules: number
  currentLevel: string
  nextMilestone: string
  estimatedCompletion: string
}

export default function Dashboard({ userProfile, onResetSetup }: DashboardProps) {
  const [learningProgress] = useKV<LearningProgress>('learning-progress', {
    completedModules: 3,
    totalModules: 12,
    currentLevel: 'L100',
    nextMilestone: 'Azure Fundamentals Assessment',
    estimatedCompletion: '2 weeks'
  })

  const progressPercentage = (learningProgress.completedModules / learningProgress.totalModules) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Learning Coach</h1>
                <p className="text-sm text-muted-foreground">Your personalized learning journey</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userProfile.timePerWeek}h/week</p>
                <p className="text-xs text-muted-foreground">{userProfile.coachingFrequency} coaching</p>
              </div>
              <Avatar>
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <p className="text-2xl font-semibold">{Math.round(progressPercentage)}%</p>
                  <p className="text-sm text-muted-foreground">
                    {learningProgress.completedModules} of {learningProgress.totalModules} modules
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-2xl font-semibold">{learningProgress.currentLevel}</p>
                  <p className="text-sm text-muted-foreground">Azure Fundamentals</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{learningProgress.nextMilestone}</p>
                  <p className="text-sm text-muted-foreground">Due in {learningProgress.estimatedCompletion}</p>
                </div>
                <Button size="sm" className="shrink-0">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Your Skills</CardTitle>
                <CardDescription>Current expertise and learning goals</CardDescription>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowCounterClockwise className="w-4 h-4 mr-2" />
                    Reset Setup
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Learning Setup</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset your learning profile and take you back to the onboarding process. 
                      Your current progress and chat history will be preserved, but you'll need to set up your skills and goals again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onResetSetup}>
                      Reset Setup
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Current Skills</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Learning Goals</p>
                <p className="text-sm text-muted-foreground">{userProfile.goals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="learning-path" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learning-path" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Learning Path
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Mentorship
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning-path">
            <LearningPath userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="assessments">
            <Assessments userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="opportunities">
            <ShadowOpportunities userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="mentorship">
            <MentorshipPanel userProfile={userProfile} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating AI Coach - Always available */}
      <FloatingAICoach userProfile={userProfile} />
    </div>
  )
}