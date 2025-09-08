import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, User, Send, Sparkles } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatProps {
  context: 'onboarding' | 'dashboard' | 'floating-coach'
  userProfile?: any
  onDataCollection?: (data: any) => void
  className?: string
  isFloating?: boolean
}

export default function Chat({ context, userProfile, onDataCollection, className, isFloating = false }: ChatProps) {
  const [messages, setMessages] = useKV<ChatMessage[]>(`chat-messages-${context}`, [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize conversation if no messages exist
    if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessage()
      setMessages([welcomeMessage])
    }
  }, [messages.length, setMessages])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getWelcomeMessage = (): ChatMessage => {
    const welcomeMessages = {
      onboarding: {
        id: 'welcome-onboarding',
        content: "Hi! I'm your AI Learning Coach 🤖 I'm here to help you create a personalized learning plan. Let's start by getting to know you better. What technical skills do you currently have?",
        role: 'assistant' as const,
        timestamp: new Date()
      },
      dashboard: {
        id: 'welcome-dashboard',
        content: `Welcome back! I'm here to help you with your learning journey. I can help you with your current progress, suggest next steps, answer questions about your learning path, or discuss any challenges you're facing. How can I assist you today?`,
        role: 'assistant' as const,
        timestamp: new Date()
      },
      'floating-coach': {
        id: 'welcome-floating',
        content: `Hi there! 👋 I'm your AI Learning Coach, ready to help whenever you need me. I can assist with your learning progress, answer questions, or provide guidance. What would you like to know?`,
        role: 'assistant' as const,
        timestamp: new Date()
      }
    }
    return welcomeMessages[context]
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateResponse(userMessage.content)
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = async (userInput: string): Promise<string> => {
    try {
      // Check if spark global is available
      if (typeof spark === 'undefined') {
        throw new Error('Spark API not available')
      }
      
      const contextPrompt = getContextPrompt(userInput)
      const prompt = spark.llmPrompt`${contextPrompt}

User input: "${userInput}"

Respond as a helpful AI learning coach. Keep responses conversational, encouraging, and actionable. If appropriate, suggest specific next steps or ask follow-up questions to better understand their needs.`

      return await spark.llm(prompt, 'gpt-4o-mini')
    } catch (error) {
      console.error('Error in generateResponse:', error)
      throw error
    }
  }

  const getContextPrompt = (userInput: string): string => {
    if (context === 'onboarding') {
      return `You are an AI Learning Coach helping a user set up their personalized learning profile. 

Current conversation context: This is during the onboarding process where you're collecting information about:
- Their current technical skills
- Learning goals they want to achieve
- Preferred coaching frequency and time commitment
- Any special learning needs or preferences

Guide them through this process conversationally, asking one thing at a time. Be encouraging and make it feel like a natural conversation rather than a form to fill out.`
    } else {
      const profileContext = userProfile ? `
User Profile:
- Skills: ${userProfile.skills?.join(', ')}
- Goals: ${userProfile.goals}
- Coaching Frequency: ${userProfile.coachingFrequency}
- Time per week: ${userProfile.timePerWeek} hours
- Special needs: ${userProfile.hasSpecialNeeds ? userProfile.specialNeeds : 'None'}
` : ''

      return `You are an AI Learning Coach helping a user with their ongoing learning journey.

${profileContext}

You can help with:
- Explaining learning concepts
- Suggesting study strategies
- Recommending next steps in their learning path
- Providing motivation and encouragement
- Answering questions about Azure, cloud technologies, or their specific learning goals
- Helping them overcome learning challenges

Be supportive, knowledgeable, and practical in your responses.`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {!isFloating && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            AI Learning Coach
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted',
                    isFloating && "px-3 py-2"
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-secondary">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="w-4 h-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className={cn("border-t p-4", isFloating && "p-3")}>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}