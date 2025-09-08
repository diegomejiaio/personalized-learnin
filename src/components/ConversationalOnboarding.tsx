import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Bot, User, Plus, X, ArrowRight } from '@phosphor-icons/react'
import { UserProfile } from '../App'

interface ConversationalOnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export default function ConversationalOnboarding({ onComplete }: ConversationalOnboardingProps) {
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

  // Conversational prompts for each step
  const getConversationalPrompt = () => {
    switch (currentStep) {
      case 1:
        return "Hi there! 👋 I'm your learning coach. Let's start by understanding your current expertise. What technical skills do you already have?"
      case 2:
        return "Great! Now, what are your learning goals? What would you like to achieve or learn next?"
      case 3:
        return "Perfect! Let's set up your coaching schedule. How often would you like coaching sessions, and how much time can you dedicate to learning each week?"
      case 4:
        return "Almost done! Do you have any specific learning needs or preferences I should know about to personalize your experience?"
      default:
        return ""
    }
  }

  const getBotAvatar = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
      <Bot className="w-5 h-5 text-primary" />
    </div>
  )

  const getUserAvatar = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-accent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl p-4">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-semibold mb-2">Learning Coach Setup</h1>
          <p className="text-muted-foreground mb-6">Let's get to know each other</p>
          <Progress value={progress} className="h-2 max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 4</p>
        </div>

        {/* Conversational Interface */}
        <div className="space-y-6 max-w-xl mx-auto">
          {/* Bot Message */}
          <div className="flex gap-3 items-start">
            {getBotAvatar()}
            <Card className="flex-1 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">{getConversationalPrompt()}</p>
              </CardContent>
            </Card>
          </div>

          {/* User Response Area */}
          <div className="flex gap-3 items-start">
            {getUserAvatar()}
            <Card className="flex-1">
              <CardContent className="p-4 space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a skill and press Enter"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        className="flex-1"
                      />
                      <Button onClick={addSkill} size="icon" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Skill Suggestions */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Popular skills to get you started:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'Azure', 'AWS', 'Kubernetes', 'Docker', 'React', 'Node.js',
                          'Python', 'C#', '.NET', 'JavaScript', 'TypeScript', 'SQL',
                          'DevOps', 'CI/CD', 'Terraform', 'PowerShell', 'Git', 'Agile'
                        ].filter(suggestion => !skills.includes(suggestion)).map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs justify-start px-2 hover:bg-primary/10 hover:border-primary/30"
                            onClick={() => {
                              if (!skills.includes(suggestion)) {
                                setSkills([...skills, suggestion])
                              }
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {skills.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Your skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1">
                              {skill}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 ml-2 hover:bg-destructive/20"
                                onClick={() => removeSkill(skill)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Tell me about your learning goals..."
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Examples: "Azure AI L200 certification", "Kubernetes fundamentals", "Advanced React patterns"
                    </p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">How often would you like coaching sessions?</p>
                      <Select value={coachingFrequency} onValueChange={(value: any) => setCoachingFrequency(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly sessions</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly sessions</SelectItem>
                          <SelectItem value="monthly">Monthly sessions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Time you can dedicate per week:</p>
                      <div className="px-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">1 hour</span>
                          <span className="text-lg font-semibold text-primary">{timePerWeek[0]} hours</span>
                          <span className="text-sm text-muted-foreground">20 hours</span>
                        </div>
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
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="text-sm font-medium">I have special learning needs</p>
                        <p className="text-xs text-muted-foreground">
                          Learning disabilities, preferences, or accommodations
                        </p>
                      </div>
                      <Switch checked={hasSpecialNeeds} onCheckedChange={setHasSpecialNeeds} />
                    </div>
                    
                    {hasSpecialNeeds && (
                      <div className="space-y-3 pt-2">
                        <Textarea
                          placeholder="Describe your learning accommodations or preferences..."
                          value={specialNeeds}
                          onChange={(e) => setSpecialNeeds(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <Input
                          placeholder="Preferred learning style (e.g., visual, auditory, hands-on)"
                          value={learningStyle}
                          onChange={(e) => setLearningStyle(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()}
              className="px-6"
            >
              {currentStep === 4 ? 'Complete Setup' : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}