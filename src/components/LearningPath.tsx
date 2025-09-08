import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Lock, ArrowRight, Calendar } from '@phosphor-icons/react'
import { UserProfile } from '../App'

interface LearningPathProps {
  userProfile: UserProfile
}

interface Module {
  id: string
  title: string
  level: 'L100' | 'L200' | 'L300'
  status: 'completed' | 'in-progress' | 'locked'
  progress: number
  estimatedHours: number
  topics: string[]
}

export default function LearningPath({ userProfile }: LearningPathProps) {
  const [modules] = useKV<Module[]>('learning-modules', [
    {
      id: '1',
      title: 'Azure Fundamentals',
      level: 'L100',
      status: 'completed',
      progress: 100,
      estimatedHours: 8,
      topics: ['Cloud Concepts', 'Azure Services', 'Security', 'Pricing']
    },
    {
      id: '2',
      title: 'Azure Storage Solutions',
      level: 'L100',
      status: 'completed',
      progress: 100,
      estimatedHours: 6,
      topics: ['Blob Storage', 'File Storage', 'Table Storage', 'Queue Storage']
    },
    {
      id: '3',
      title: 'Azure Compute Services',
      level: 'L100',
      status: 'in-progress',
      progress: 65,
      estimatedHours: 10,
      topics: ['Virtual Machines', 'App Service', 'Container Instances', 'Functions']
    },
    {
      id: '4',
      title: 'Azure Networking',
      level: 'L200',
      status: 'locked',
      progress: 0,
      estimatedHours: 12,
      topics: ['Virtual Networks', 'Load Balancer', 'Application Gateway', 'VPN Gateway']
    },
    {
      id: '5',
      title: 'Azure AI Services',
      level: 'L200',
      status: 'locked',
      progress: 0,
      estimatedHours: 15,
      topics: ['Cognitive Services', 'Machine Learning', 'Bot Framework', 'Computer Vision']
    },
    {
      id: '6',
      title: 'Azure DevOps',
      level: 'L200',
      status: 'locked',
      progress: 0,
      estimatedHours: 18,
      topics: ['Pipelines', 'Repos', 'Artifacts', 'Test Plans']
    }
  ])

  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-primary" />
      case 'locked':
        return <Lock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return 'border-accent/20 bg-accent/5'
      case 'in-progress':
        return 'border-primary/20 bg-primary/5'
      case 'locked':
        return 'border-border bg-muted/30'
    }
  }

  const getLevelColor = (level: Module['level']) => {
    switch (level) {
      case 'L100':
        return 'bg-green-100 text-green-800'
      case 'L200':
        return 'bg-blue-100 text-blue-800'
      case 'L300':
        return 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Learning Timeline
          </CardTitle>
          <CardDescription>
            Your personalized path from fundamentals to advanced expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.id} className="relative">
                {index < modules.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-16 bg-border" />
                )}
                <Card className={`transition-all hover:shadow-md ${getStatusColor(module.status)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        {getStatusIcon(module.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{module.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getLevelColor(module.level)}>
                                {module.level}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {module.estimatedHours}h estimated
                              </span>
                            </div>
                          </div>
                          <Button
                            variant={module.status === 'locked' ? 'ghost' : 'default'}
                            size="sm"
                            disabled={module.status === 'locked'}
                            className="shrink-0"
                          >
                            {module.status === 'completed' ? 'Review' : 
                             module.status === 'in-progress' ? 'Continue' : 'Start'}
                            {module.status !== 'locked' && (
                              <ArrowRight className="w-4 h-4 ml-2" />
                            )}
                          </Button>
                        </div>
                        
                        {module.status !== 'locked' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Path Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-accent">2</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-primary">1</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-muted-foreground">3</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}