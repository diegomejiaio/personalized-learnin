import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Users, Clock, Star, Circle, CheckCircle, Calendar } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useState } from 'react'
import { UserProfile } from '../App'

interface MentorshipPanelProps {
  userProfile: UserProfile
}

interface Mentor {
  id: string
  name: string
  title: string
  department: string
  avatar?: string
  skills: string[]
  experience: number
  rating: number
  availability: 'available' | 'limited' | 'busy'
  responseTime: string
  mentees: number
  maxMentees: number
  bio: string
  location: string
}

interface MentorshipRequest {
  mentorId: string
  message: string
  goals: string
}

export default function MentorshipPanel({ userProfile }: MentorshipPanelProps) {
  const [mentors] = useKV<Mentor[]>('mentors', [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Principal Azure Architect',
      department: 'Cloud Solutions',
      skills: ['Azure', 'Cloud Architecture', 'AI/ML', 'DevOps'],
      experience: 8,
      rating: 4.9,
      availability: 'available',
      responseTime: '< 24h',
      mentees: 3,
      maxMentees: 5,
      bio: 'Passionate about helping engineers grow in cloud technologies. Specializing in Azure architecture and AI implementations.',
      location: 'Seattle, WA'
    },
    {
      id: '2',
      name: 'David Rodriguez',
      title: 'Senior Software Engineering Manager',
      department: 'Developer Division',
      skills: ['React', 'TypeScript', 'Leadership', 'System Design'],
      experience: 12,
      rating: 4.8,
      availability: 'available',
      responseTime: '< 48h',
      mentees: 4,
      maxMentees: 6,
      bio: 'Former startup founder turned Microsoft engineer. Love mentoring on technical leadership and modern web development.',
      location: 'Remote'
    },
    {
      id: '3',
      name: 'Alex Kumar',
      title: 'Principal DevOps Engineer',
      department: 'Azure Platform',
      skills: ['Kubernetes', 'CI/CD', 'Infrastructure', 'Monitoring'],
      experience: 10,
      rating: 4.7,
      availability: 'limited',
      responseTime: '< 72h',
      mentees: 5,
      maxMentees: 5,
      bio: 'Infrastructure enthusiast with deep expertise in Kubernetes and cloud-native technologies. Enjoy sharing knowledge about scalable systems.',
      location: 'Austin, TX'
    },
    {
      id: '4',
      name: 'Emma Thompson',
      title: 'Senior Data Scientist',
      department: 'AI Research',
      skills: ['Machine Learning', 'Python', 'Data Science', 'Research'],
      experience: 6,
      rating: 4.9,
      availability: 'available',
      responseTime: '< 24h',
      mentees: 2,
      maxMentees: 4,
      bio: 'PhD in Computer Science with focus on ML algorithms. Passionate about making AI accessible and practical for business applications.',
      location: 'San Francisco, CA'
    },
    {
      id: '5',
      name: 'Michael Park',
      title: 'Principal Program Manager',
      department: 'Data & AI',
      skills: ['Product Management', 'Strategy', 'Analytics', 'Leadership'],
      experience: 15,
      rating: 4.6,
      availability: 'busy',
      responseTime: '< 1 week',
      mentees: 6,
      maxMentees: 6,
      bio: 'Veteran PM with experience across multiple product lines. Focus on data-driven decision making and strategic product development.',
      location: 'Redmond, WA'
    }
  ])

  const [mentorshipRequests, setMentorshipRequests] = useKV<string[]>('mentorship-requests', [])
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestGoals, setRequestGoals] = useState('')

  const getMatchingSkills = (mentorSkills: string[]) => {
    return mentorSkills.filter(skill => 
      userProfile.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
  }

  const getMatchScore = (mentor: Mentor) => {
    const matchingSkills = getMatchingSkills(mentor.skills)
    const skillMatch = matchingSkills.length / mentor.skills.length
    const availabilityBonus = mentor.availability === 'available' ? 0.2 : 
                            mentor.availability === 'limited' ? 0.1 : 0
    return Math.min(100, Math.round((skillMatch + availabilityBonus) * 100))
  }

  const getAvailabilityColor = (availability: Mentor['availability']) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'limited':
        return 'bg-yellow-100 text-yellow-800'
      case 'busy':
        return 'bg-red-100 text-red-800'
    }
  }

  const getAvailabilityIcon = (availability: Mentor['availability']) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />
      case 'limited':
        return <Clock className="w-4 h-4" />
      case 'busy':
        return <Calendar className="w-4 h-4" />
    }
  }

  const handleRequestMentorship = () => {
    if (!selectedMentor || !requestMessage.trim() || !requestGoals.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setMentorshipRequests(current => [...current, selectedMentor.id])
    toast.success(`Mentorship request sent to ${selectedMentor.name}!`)
    setSelectedMentor(null)
    setRequestMessage('')
    setRequestGoals('')
  }

  const sortedMentors = [...mentors].sort((a, b) => {
    const aRequested = mentorshipRequests.includes(a.id)
    const bRequested = mentorshipRequests.includes(b.id)
    
    if (aRequested !== bRequested) {
      return aRequested ? 1 : -1 // Put requested mentors at the end
    }
    
    const aScore = getMatchScore(a)
    const bScore = getMatchScore(b)
    
    if (aScore !== bScore) {
      return bScore - aScore
    }
    
    // Then by availability
    const availabilityOrder = { available: 0, limited: 1, busy: 2 }
    return availabilityOrder[a.availability] - availabilityOrder[b.availability]
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Find Your Mentor
          </CardTitle>
          <CardDescription>
            Connect with experienced professionals who can guide your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-primary">
                {mentors.filter(m => m.availability === 'available').length}
              </p>
              <p className="text-sm text-muted-foreground">Available Mentors</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-blue-600">{mentorshipRequests.length}</p>
              <p className="text-sm text-muted-foreground">Requests Sent</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-accent">
                {Math.round(sortedMentors.slice(0, 3).reduce((sum, m) => sum + getMatchScore(m), 0) / 3)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Match</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedMentors.map((mentor) => {
          const matchingSkills = getMatchingSkills(mentor.skills)
          const matchScore = getMatchScore(mentor)
          const hasRequested = mentorshipRequests.includes(mentor.id)
          const canRequest = !hasRequested && mentor.mentees < mentor.maxMentees && mentor.availability !== 'busy'
          
          return (
            <Card key={mentor.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback>
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{mentor.title}</p>
                        <p className="text-xs text-muted-foreground">{mentor.department}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                        </div>
                        {matchScore >= 70 && (
                          <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                            {matchScore}% match
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => {
                        const isMatching = matchingSkills.includes(skill)
                        return (
                          <Badge
                            key={skill}
                            variant={isMatching ? "default" : "secondary"}
                            className={isMatching ? "bg-accent/10 text-accent border-accent/20" : ""}
                          >
                            {skill}
                            {isMatching && " ✓"}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {mentor.responseTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {mentor.mentees}/{mentor.maxMentees}
                      </div>
                    </div>
                    <Badge variant="outline" className={getAvailabilityColor(mentor.availability)}>
                      <div className="flex items-center gap-1">
                        {getAvailabilityIcon(mentor.availability)}
                        {mentor.availability}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Circle className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={mentor.avatar} />
                              <AvatarFallback>
                                {mentor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{mentor.name}</div>
                              <div className="text-sm text-muted-foreground font-normal">
                                {mentor.title}
                              </div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm">{mentor.bio}</p>
                          <div>
                            <p className="font-medium mb-2">Experience</p>
                            <p className="text-sm text-muted-foreground">
                              {mentor.experience} years in {mentor.department}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Located in {mentor.location}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Skills & Expertise</p>
                            <div className="flex flex-wrap gap-2">
                              {mentor.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {hasRequested ? (
                      <Button disabled className="flex-1">
                        Request Sent
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            disabled={!canRequest}
                            className="flex-1"
                            onClick={() => setSelectedMentor(mentor)}
                          >
                            Request Mentor
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Mentorship</DialogTitle>
                            <DialogDescription>
                              Send a mentorship request to {selectedMentor?.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="goals">Your Learning Goals</Label>
                              <Textarea
                                id="goals"
                                placeholder="What do you hope to achieve through this mentorship?"
                                value={requestGoals}
                                onChange={(e) => setRequestGoals(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="message">Personal Message</Label>
                              <Textarea
                                id="message"
                                placeholder="Introduce yourself and explain why you'd like this person as your mentor"
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setSelectedMentor(null)} className="flex-1">
                                Cancel
                              </Button>
                              <Button onClick={handleRequestMentorship} className="flex-1">
                                Send Request
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}