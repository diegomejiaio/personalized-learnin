import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, Users, Calendar, ExternalLink, Target } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { UserProfile } from '../App'

interface ShadowOpportunitiesProps {
  userProfile: UserProfile
}

interface ShadowOpportunity {
  id: string
  title: string
  description: string
  company: string
  pjm: string
  pjmEmail: string
  skills: string[]
  duration: string
  location: string
  status: 'open' | 'applied' | 'closed'
  applicants: number
  maxApplicants: number
}

export default function ShadowOpportunities({ userProfile }: ShadowOpportunitiesProps) {
  const [opportunities] = useKV<ShadowOpportunity[]>('shadow-opportunities', [
    {
      id: '1',
      title: 'Azure AI Implementation Project',
      description: 'Join our team implementing AI solutions for healthcare data analysis. Work with Azure Cognitive Services, Machine Learning, and Power BI to create intelligent dashboards.',
      company: 'Microsoft Healthcare Solutions',
      pjm: 'Sarah Chen',
      pjmEmail: 'sarah.chen@microsoft.com',
      skills: ['Azure AI', 'Machine Learning', 'Power BI', 'Healthcare'],
      duration: '2-3 weeks',
      location: 'Redmond, WA / Remote',
      status: 'open',
      applicants: 3,
      maxApplicants: 5
    },
    {
      id: '2',
      title: 'Cloud Migration Strategy',
      description: 'Shadow our cloud architects as they design and implement a large-scale migration from on-premises to Azure. Learn about assessment, planning, and execution phases.',
      company: 'Microsoft Consulting Services',
      pjm: 'David Rodriguez',
      pjmEmail: 'david.rodriguez@microsoft.com',
      skills: ['Azure', 'Cloud Architecture', 'Migration', 'DevOps'],
      duration: '3-4 weeks',
      location: 'Seattle, WA',
      status: 'open',
      applicants: 2,
      maxApplicants: 3
    },
    {
      id: '3',
      title: 'Kubernetes at Scale',
      description: 'Observe how we manage Kubernetes clusters for enterprise customers. Focus on AKS, monitoring, security, and automated deployment pipelines.',
      company: 'Microsoft Azure Team',
      pjm: 'Alex Kumar',
      pjmEmail: 'alex.kumar@microsoft.com',
      skills: ['Kubernetes', 'AKS', 'DevOps', 'Monitoring'],
      duration: '2 weeks',
      location: 'Remote',
      status: 'applied',
      applicants: 4,
      maxApplicants: 4
    },
    {
      id: '4',
      title: 'Modern Web Development',
      description: 'Join our frontend team building next-generation web applications using React, TypeScript, and Azure Static Web Apps. Learn modern development practices.',
      company: 'Microsoft Developer Division',
      pjm: 'Emma Thompson',
      pjmEmail: 'emma.thompson@microsoft.com',
      skills: ['React', 'TypeScript', 'Azure', 'Web Development'],
      duration: '3 weeks',
      location: 'San Francisco, CA / Remote',
      status: 'closed',
      applicants: 8,
      maxApplicants: 6
    },
    {
      id: '5',
      title: 'Data Analytics Pipeline',
      description: 'Shadow our data engineering team as they build real-time analytics pipelines using Azure Data Factory, Synapse, and Power BI for business intelligence.',
      company: 'Microsoft Data & AI',
      pjm: 'Michael Park',
      pjmEmail: 'michael.park@microsoft.com',
      skills: ['Azure Data Factory', 'Synapse', 'Power BI', 'SQL'],
      duration: '2-3 weeks',
      location: 'Austin, TX / Remote',
      status: 'open',
      applicants: 1,
      maxApplicants: 4
    }
  ])

  const [appliedOpportunities, setAppliedOpportunities] = useKV<string[]>('applied-opportunities', ['3'])

  const getMatchingSkills = (opportunitySkills: string[]) => {
    return opportunitySkills.filter(skill => 
      userProfile.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
  }

  const getMatchScore = (opportunity: ShadowOpportunity) => {
    const matchingSkills = getMatchingSkills(opportunity.skills)
    return Math.round((matchingSkills.length / opportunity.skills.length) * 100)
  }

  const handleApply = (opportunityId: string) => {
    setAppliedOpportunities(current => [...current, opportunityId])
    toast.success('Application submitted! The PJM will be notified.')
  }

  const getStatusBadge = (status: ShadowOpportunity['status'], isApplied: boolean) => {
    if (isApplied) {
      return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>
    }
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800">Open</Badge>
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    // Applied first, then by match score, then by status
    const aApplied = appliedOpportunities.includes(a.id)
    const bApplied = appliedOpportunities.includes(b.id)
    
    if (aApplied !== bApplied) {
      return aApplied ? -1 : 1
    }
    
    const aScore = getMatchScore(a)
    const bScore = getMatchScore(b)
    
    if (aScore !== bScore) {
      return bScore - aScore
    }
    
    if (a.status !== b.status) {
      if (a.status === 'open') return -1
      if (b.status === 'open') return 1
    }
    
    return 0
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recommended Opportunities
          </CardTitle>
          <CardDescription>
            Shadow opportunities matched to your skills and learning goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-primary">{opportunities.filter(o => o.status === 'open').length}</p>
              <p className="text-sm text-muted-foreground">Open Positions</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-blue-600">{appliedOpportunities.length}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-accent">
                {Math.round(sortedOpportunities.slice(0, 3).reduce((sum, o) => sum + getMatchScore(o), 0) / 3)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Match</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedOpportunities.map((opportunity) => {
          const matchingSkills = getMatchingSkills(opportunity.skills)
          const matchScore = getMatchScore(opportunity)
          const isApplied = appliedOpportunities.includes(opportunity.id)
          
          return (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      {getStatusBadge(opportunity.status, isApplied)}
                      {matchScore >= 70 && (
                        <Badge className="bg-accent/10 text-accent border-accent/20">
                          {matchScore}% match
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {opportunity.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {opportunity.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {opportunity.applicants}/{opportunity.maxApplicants}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {opportunity.description}
                </CardDescription>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => {
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
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">Project Manager</p>
                      <p className="text-muted-foreground">{opportunity.pjm}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${opportunity.pjmEmail}?subject=Question about ${opportunity.title}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Contact PJM
                      </Button>
                      <Button
                        size="sm"
                        disabled={opportunity.status !== 'open' || isApplied || opportunity.applicants >= opportunity.maxApplicants}
                        onClick={() => handleApply(opportunity.id)}
                      >
                        {isApplied ? 'Applied' : 
                         opportunity.status === 'closed' ? 'Closed' :
                         opportunity.applicants >= opportunity.maxApplicants ? 'Full' : 'Apply to Shadow'}
                      </Button>
                    </div>
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