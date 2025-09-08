import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, Target, Clock, Settings, Plus, X, MessageCircle, ClipboardText } from '@phosphor-icons/react'
import { UserProfile } from '../App'
import Chat from './Chat'

interface ConversationalOnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export default function ConversationalOnboarding({ onComplete }: ConversationalOnboardingProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'form'>('chat')
  const [currentStep, setCurrentStep] = useState(1)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [goals, setGoals] = useState('')
  const [coachingFrequency, setCoachingFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly')
  const [timePerWeek, setTimePerWeek] = useState([5])
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState(false)
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [learningStyle, setLearningStyle] = useState('')

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete({
        skills,
        goals,
        coachingFrequency,
        timePerWeek: timePerWeek[0],
        hasSpecialNeeds,
        specialNeeds,
        learningStyle
      })
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return skills.length > 0
      case 2: return goals.trim().length > 0
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  const progress = (currentStep / 4) * 100
  const stepIcons = [GraduationCap, Target, Clock, Settings]
  const StepIcon = stepIcons[currentStep - 1]

  const handleChatDataCollection = (data: any) => {
    // Handle data collection from chat if needed
    if (data.skills) setSkills(data.skills)
    if (data.goals) setGoals(data.goals)
    // Add other data mappings as needed
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
            <StepIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">Welcome to Your Learning Coach</h1>
          <p className="text-muted-foreground mb-6">Let's personalize your learning experience</p>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 4</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-280px)]">
          {/* Chat Interface */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Conversational Setup</h2>
            </div>
            <Chat 
              context="onboarding" 
              onDataCollection={handleChatDataCollection}
              className="flex-1"
            />
          </div>

          {/* Traditional Form */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Quick Form</h2>
            </div>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-xl">
                  {currentStep === 1 && 'Current Skills'}
                  {currentStep === 2 && 'Learning Goals'}
                  {currentStep === 3 && 'Coaching Preferences'}
                  {currentStep === 4 && 'Special Needs'}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Add your existing technical skills and expertise'}
                  {currentStep === 2 && 'What would you like to learn or achieve?'}
                  {currentStep === 3 && 'Set your coaching frequency and time commitment'}
                  {currentStep === 4 && 'Any learning accommodations or preferences?'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Azure, React, Python"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill} size="icon" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
                      {skills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      ) : (
                        skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-3 py-1">
                            {skill}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 ml-2"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <Textarea
                      placeholder="e.g., Azure AI L200 certification, Kubernetes fundamentals, Advanced React patterns"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base">Coaching Frequency</Label>
                      <Select value={coachingFrequency} onValueChange={(value: any) => setCoachingFrequency(value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-base">Time Available Per Week</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        {timePerWeek[0]} hours per week
                      </p>
                      <Slider
                        value={timePerWeek}
                        onValueChange={setTimePerWeek}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Special Learning Needs</Label>
                        <p className="text-sm text-muted-foreground">
                          Do you have any learning disabilities or preferences?
                        </p>
                      </div>
                      <Switch checked={hasSpecialNeeds} onCheckedChange={setHasSpecialNeeds} />
                    </div>
                    {hasSpecialNeeds && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="special-needs">Learning Accommodations</Label>
                          <Textarea
                            id="special-needs"
                            placeholder="e.g., Dyslexia-friendly fonts, high contrast mode, audio content"
                            value={specialNeeds}
                            onChange={(e) => setSpecialNeeds(e.target.value)}
                            rows={3}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="learning-style">Preferred Learning Style</Label>
                          <Input
                            id="learning-style"
                            placeholder="e.g., Visual, auditory, hands-on"
                            value={learningStyle}
                            onChange={(e) => setLearningStyle(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    {currentStep === 4 ? 'Complete Setup' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>You can use either the chat interface or the form to set up your profile. Both approaches will create the same personalized learning experience.</p>
        </div>
      </div>
    </div>
  )
}