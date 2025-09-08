import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle, Clock, Award, Brain, Code, Target } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { UserProfile } from '../App'

interface AssessmentsProps {
  userProfile: UserProfile
}

interface Assessment {
  id: string
  title: string
  type: 'quiz' | 'hands-on'
  difficulty: 'L100' | 'L200' | 'L300'
  status: 'available' | 'completed' | 'locked'
  score?: number
  questions: Question[]
  description: string
  estimatedTime: number
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function Assessments({ userProfile }: AssessmentsProps) {
  const [assessments] = useKV<Assessment[]>('assessments', [
    {
      id: '1',
      title: 'Azure Fundamentals Quiz',
      type: 'quiz',
      difficulty: 'L100',
      status: 'completed',
      score: 85,
      estimatedTime: 30,
      description: 'Test your understanding of basic Azure concepts and services',
      questions: [
        {
          id: '1',
          question: 'What is the primary benefit of cloud computing?',
          options: ['Cost reduction', 'Scalability and flexibility', 'Better security', 'Faster deployment'],
          correctAnswer: 1,
          explanation: 'While all options can be benefits, scalability and flexibility are the primary advantages of cloud computing.'
        },
        {
          id: '2',
          question: 'Which Azure service is best for hosting web applications?',
          options: ['Azure Storage', 'Azure App Service', 'Azure SQL Database', 'Azure Virtual Network'],
          correctAnswer: 1,
          explanation: 'Azure App Service is specifically designed for hosting web applications and APIs.'
        }
      ]
    },
    {
      id: '2',
      title: 'Storage Solutions Assessment',
      type: 'quiz',
      difficulty: 'L100',
      status: 'completed',
      score: 92,
      estimatedTime: 25,
      description: 'Evaluate your knowledge of Azure storage options and use cases',
      questions: []
    },
    {
      id: '3',
      title: 'Compute Services Challenge',
      type: 'hands-on',
      difficulty: 'L100',
      status: 'available',
      estimatedTime: 45,
      description: 'Deploy and configure Azure compute resources in a real environment',
      questions: []
    },
    {
      id: '4',
      title: 'Azure Networking Deep Dive',
      type: 'quiz',
      difficulty: 'L200',
      status: 'locked',
      estimatedTime: 40,
      description: 'Advanced networking concepts and implementation strategies',
      questions: []
    }
  ])

  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const getStatusIcon = (status: Assessment['status'], score?: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" />
      case 'available':
        return <Clock className="w-5 h-5 text-primary" />
      case 'locked':
        return <Target className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getTypeIcon = (type: Assessment['type']) => {
    return type === 'quiz' ? <Brain className="w-4 h-4" /> : <Code className="w-4 h-4" />
  }

  const getDifficultyColor = (difficulty: Assessment['difficulty']) => {
    switch (difficulty) {
      case 'L100':
        return 'bg-green-100 text-green-800'
      case 'L200':
        return 'bg-blue-100 text-blue-800'
      case 'L300':
        return 'bg-purple-100 text-purple-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentAssessment && currentQuestionIndex < currentAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    if (!currentAssessment) return 0
    const correctAnswers = currentAssessment.questions.filter(
      q => selectedAnswers[q.id] === q.correctAnswer
    ).length
    return Math.round((correctAnswers / currentAssessment.questions.length) * 100)
  }

  const completeAssessment = () => {
    const score = calculateScore()
    toast.success(`Assessment completed! You scored ${score}%`)
    setCurrentAssessment(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(assessment.status, assessment.score)}
                  <div>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getDifficultyColor(assessment.difficulty)}>
                        {assessment.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getTypeIcon(assessment.type)}
                        {assessment.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                {assessment.status === 'completed' && assessment.score && (
                  <div className="text-right">
                    <div className={`text-2xl font-semibold ${getScoreColor(assessment.score)}`}>
                      {assessment.score}%
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {assessment.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {assessment.estimatedTime} minutes
                </span>
                {assessment.type === 'quiz' && assessment.questions.length > 0 ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={assessment.status === 'completed' ? 'outline' : 'default'}
                        disabled={assessment.status === 'locked'}
                        onClick={() => startAssessment(assessment)}
                      >
                        {assessment.status === 'completed' ? 'Retake' : 'Start Assessment'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{currentAssessment?.title}</DialogTitle>
                        <DialogDescription>
                          {showResults ? 'Assessment Results' : `Question ${currentQuestionIndex + 1} of ${currentAssessment?.questions.length}`}
                        </DialogDescription>
                      </DialogHeader>
                      {currentAssessment && !showResults && (
                        <div className="space-y-6">
                          <Progress value={((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100} />
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              {currentAssessment.questions[currentQuestionIndex]?.question}
                            </h3>
                            <RadioGroup
                              value={selectedAnswers[currentAssessment.questions[currentQuestionIndex]?.id]?.toString()}
                              onValueChange={(value) => 
                                handleAnswerSelect(
                                  currentAssessment.questions[currentQuestionIndex].id,
                                  parseInt(value)
                                )
                              }
                            >
                              {currentAssessment.questions[currentQuestionIndex]?.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                              disabled={currentQuestionIndex === 0}
                            >
                              Previous
                            </Button>
                            <Button
                              onClick={handleNext}
                              disabled={!selectedAnswers[currentAssessment.questions[currentQuestionIndex]?.id]}
                            >
                              {currentQuestionIndex === currentAssessment.questions.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                          </div>
                        </div>
                      )}
                      {showResults && currentAssessment && (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(calculateScore())}`}>
                              {calculateScore()}%
                            </div>
                            <p className="text-muted-foreground">Your Score</p>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold">Review:</h4>
                            {currentAssessment.questions.map((question, index) => {
                              const userAnswer = selectedAnswers[question.id]
                              const isCorrect = userAnswer === question.correctAnswer
                              return (
                                <div key={question.id} className="p-4 border rounded-lg">
                                  <p className="font-medium mb-2">{question.question}</p>
                                  <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    Your answer: {question.options[userAnswer]} {isCorrect ? '✓' : '✗'}
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-sm text-green-600">
                                      Correct answer: {question.options[question.correctAnswer]}
                                    </p>
                                  )}
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {question.explanation}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                          <Button onClick={completeAssessment} className="w-full">
                            Complete Assessment
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    variant={assessment.status === 'completed' ? 'outline' : 'default'}
                    disabled={assessment.status === 'locked'}
                  >
                    {assessment.status === 'completed' ? 'Review' : 'Start'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Assessment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-accent">2</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-primary">1</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">88%</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}