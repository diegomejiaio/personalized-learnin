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
import { GraduationCap, Target, Clock, Settings, Plus, X } from '@phosphor-icons/react'
import { UserProfile } from '../App'

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
            <StepIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">Welcome to Your Learning Coach</CardTitle>
          <CardDescription>Let's personalize your learning experience</CardDescription>
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 4</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="skills">Current Skills</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Add your existing technical skills and expertise
                </p>
                <div className="flex gap-2 mb-4">
                  <Input
                    id="skills"
                    placeholder="e.g., Azure, React, Python"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="goals">Learning Goals</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  What would you like to learn or achieve?
                </p>
                <Textarea
                  id="goals"
                  placeholder="e.g., Azure AI L200 certification, Kubernetes fundamentals, Advanced React patterns"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Coaching Frequency</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  How often would you like coaching sessions?
                </p>
                <Select value={coachingFrequency} onValueChange={(value: any) => setCoachingFrequency(value)}>
                  <SelectTrigger>
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
                <Label>Time Available Per Week</Label>
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
                  <Label>Special Learning Needs</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="learning-style">Preferred Learning Style</Label>
                    <Input
                      id="learning-style"
                      placeholder="e.g., Visual, auditory, hands-on"
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-6">
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
  )
}