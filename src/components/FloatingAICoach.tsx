import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Robot, X, Minus } from '@phosphor-icons/react'
import { UserProfile } from '../App'
import Chat from './Chat'

interface FloatingAICoachProps {
  userProfile: UserProfile
}

export default function FloatingAICoach({ userProfile }: FloatingAICoachProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true)
    } else {
      setIsOpen(!isOpen)
      setIsMinimized(false)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  return (
    <>
      {/* Floating Button */}
      {(!isOpen || isMinimized) && (
        <Button
          onClick={toggleChat}
          size="lg"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        >
          <Robot className="w-6 h-6" />
          <span className="sr-only">Open AI Coach</span>
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && !isMinimized && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl border border-border bg-card rounded-lg overflow-hidden">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Robot className="w-4 h-4 text-primary" />
                </div>
                AI Learning Coach
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeChat}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(500px-80px)]">
            <Chat 
              context="floating-coach" 
              userProfile={userProfile}
              className="h-full border-none rounded-none"
              isFloating={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <Card className="fixed bottom-6 right-6 z-50 w-64 shadow-lg border border-border bg-card cursor-pointer rounded-lg" onClick={() => setIsMinimized(false)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Robot className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">AI Coach</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  closeChat()
                }}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Click to expand chat</p>
          </CardContent>
        </Card>
      )}
    </>
  )
}