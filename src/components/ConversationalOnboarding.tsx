import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Robot, User, Plus, X, ArrowRight } from '@phosphor-icons/react'
import { UserProfile } from '../App'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: React.ReactNode
  timestamp: Date
}

interface ConversationalOnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export default function ConversationalOnboarding({ onComplete }: ConversationalOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [messages, setMessages] = useState<Message[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [goals, setGoals] = useState('')
  const [coachingFrequency, setCoachingFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly')
  const [timePerWeek, setTimePerWeek] = useState([5])
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState(false)
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [learningStyle, setLearningStyle] = useState('')
  const [showCurrentInput, setShowCurrentInput] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: "Hi there! 👋 I'm your learning coach. Let's start by understanding your current expertise. What technical skills do you already have?",
        timestamp: new Date()
      }])
    }
  }, [])

  const addMessage = (type: 'bot' | 'user', content: React.ReactNode) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill])
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleStepComplete = () => {
    let userResponse: React.ReactNode = null
    let nextBotMessage: string = ''

    switch (currentStep) {
      case 1:
        if (skills.length === 0) return
        userResponse = (
          <div className="space-y-2">
            <p className="text-sm">My current skills:</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )
        nextBotMessage = "Great! Now, what are your learning goals? What would you like to achieve or learn next?"
        break
      
      case 2:
        if (!goals.trim()) return
        userResponse = (
          <div className="space-y-1">
            <p className="text-sm font-medium">My learning goals:</p>
            <p className="text-sm">{goals}</p>
          </div>
        )
        nextBotMessage = "Perfect! Let's set up your coaching schedule. How often would you like coaching sessions, and how much time can you dedicate to learning each week?"
        break
      
      case 3:
        userResponse = (
          <div className="space-y-2">
            <p className="text-sm"><strong>Coaching frequency:</strong> {coachingFrequency} sessions</p>
            <p className="text-sm"><strong>Time commitment:</strong> {timePerWeek[0]} hours per week</p>
          </div>
        )
        nextBotMessage = "Almost done! Do you have any specific learning needs or preferences I should know about to personalize your experience?"
        break
      
      case 4:
        userResponse = hasSpecialNeeds ? (
          <div className="space-y-2">
            <p className="text-sm"><strong>Special needs:</strong> Yes</p>
            {specialNeeds && <p className="text-sm"><strong>Details:</strong> {specialNeeds}</p>}
            {learningStyle && <p className="text-sm"><strong>Learning style:</strong> {learningStyle}</p>}
          </div>
        ) : (
          <p className="text-sm">No special learning needs</p>
        )
        
        // Complete onboarding
        setTimeout(() => {
          addMessage('bot', "Perfect! I have everything I need to create your personalized learning journey. Let's get started! 🚀")
          setTimeout(() => {
            onComplete({
              skills,
              goals,
              coachingFrequency,
              timePerWeek: timePerWeek[0],
              hasSpecialNeeds,
              specialNeeds,
              learningStyle
            })
          }, 1500)
        }, 500)
        break
    }

    // Add user response
    if (userResponse) {
      addMessage('user', userResponse)
    }

    // Hide current input and show next bot message
    setShowCurrentInput(false)
    
    if (nextBotMessage && currentStep < 4) {
      setTimeout(() => {
        addMessage('bot', nextBotMessage)
        setCurrentStep(currentStep + 1)
        setShowCurrentInput(true)
      }, 1000)
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

  const getBotAvatar = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
      <Robot className="w-5 h-5 text-primary" />
    </div>
  )

  const getUserAvatar = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-accent" />
    </div>
  )

  const renderCurrentInput = () => {
    if (!showCurrentInput) return null

    return (
      <div className="flex gap-3 items-start animate-in fade-in-50 duration-500">
        {getUserAvatar()}
        <Card className="flex-1">
          <CardContent className="px-4 py-2 space-y-4">
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
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Azure', 'Kubernetes', 'React', 'Python'
                    ].filter(suggestion => !skills.includes(suggestion)).map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2 hover:bg-primary/10 hover:border-primary/30"
                        onClick={() => addSuggestedSkill(suggestion)}
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
                  <div className="space-y-3 pt-2 animate-in fade-in-50 duration-300">
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

            {/* Continue Button */}
            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleStepComplete} 
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Header with Progress */}
      <div className="lg:hidden border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-semibold mb-1">Learning Coach Setup</h1>
          <p className="text-sm text-muted-foreground mb-3">Let's get to know each other</p>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">Step {currentStep} of 4</p>
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <div className="hidden lg:block border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto p-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold mb-2">Learning Coach Setup</h1>
              <p className="text-muted-foreground">Let's get to know each other</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto h-full">
            <div className="max-w-2xl h-full flex flex-col">
              <div className="flex-1 space-y-6 p-4 lg:p-6 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 items-start animate-in fade-in-50 duration-500`}>
                    {message.type === 'bot' ? getBotAvatar() : getUserAvatar()}
                    <Card className={`flex-1 ${message.type === 'bot' ? 'bg-primary/5 border-primary/20' : ''}`}>
                      <CardContent className="px-4 py-2">
                        {typeof message.content === 'string' ? (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                          message.content
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
                
                {/* Current Input */}
                {renderCurrentInput()}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel - Progress Stepper (Desktop Only) */}
      <div className="hidden lg:block w-80 border-l bg-card/30 backdrop-blur-sm">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Setup Progress</h2>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
          </div>

          {/* Step Indicators */}
          <div className="space-y-4 flex-1">
            {[
              { step: 1, title: 'Current Skills', desc: 'Tell us what you already know' },
              { step: 2, title: 'Learning Goals', desc: 'What do you want to achieve?' },
              { step: 3, title: 'Schedule & Time', desc: 'Set your coaching preferences' },
              { step: 4, title: 'Special Needs', desc: 'Any specific requirements?' }
            ].map((item) => (
              <div key={item.step} className={`flex gap-3 p-3 rounded-lg transition-colors ${
                currentStep === item.step 
                  ? 'bg-primary/10 border border-primary/20' 
                  : currentStep > item.step 
                    ? 'bg-accent/10 border border-accent/20' 
                    : 'bg-muted/30 border border-border'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === item.step 
                    ? 'bg-primary text-primary-foreground' 
                    : currentStep > item.step 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > item.step ? '✓' : item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    currentStep >= item.step ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {item.title}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= item.step ? 'text-muted-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Step Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Current Step</h3>
            <p className="text-xs text-muted-foreground">
              {currentStep === 1 && "Add your existing technical skills to help us understand your background."}
              {currentStep === 2 && "Describe what you want to learn or achieve in your learning journey."}
              {currentStep === 3 && "Choose how often you'd like coaching sessions and time commitment."}
              {currentStep === 4 && "Let us know if you have any special learning needs or preferences."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}