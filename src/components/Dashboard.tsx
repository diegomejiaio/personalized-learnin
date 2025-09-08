import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, Target, Clock, Users, CheckCircle, ArrowRight, Play, User, MessageCircle } from '@phosphor-icons/react'
import { UserProfile } from '../App'
import LearningPath from './LearningPath'
import Assessments from './Assessments'
import ShadowOpportunities from './ShadowOpportunities'
import MentorshipPanel from './MentorshipPanel'
import Chat from './Chat'

interface DashboardProps {
  userProfile: UserProfile
}

interface LearningProgress {
  completedModules: number
  totalModules: number
  currentLevel: string
  nextMilestone: string
  estimatedCompletion: string
}

export default function Dashboard({ userProfile }: DashboardProps) {
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
            <CardTitle className="text-lg">Your Skills</CardTitle>
            <CardDescription>Current expertise and learning goals</CardDescription>
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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Coach
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

          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Chat 
                  context="dashboard" 
                  userProfile={userProfile}
                  className="h-[600px]"
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Ask about my progress
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Get study recommendations
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Explain a concept
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Find learning resources
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Coach Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>Personalized guidance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>Progress tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>Study strategy tips</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>Concept explanations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>Resource recommendations</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}