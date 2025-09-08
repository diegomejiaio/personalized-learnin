# Personalized Learning Coach Dashboard

A comprehensive learning management platform that guides employees through personalized skill development with AI-powered coaching, assessments, and mentorship opportunities.

**Experience Qualities**:
1. **Intuitive** - Clear navigation and progressive disclosure make complex learning paths feel manageable
2. **Supportive** - Accessible design and personalization options ensure inclusivity for all learning styles
3. **Motivating** - Visual progress indicators and achievement milestones create engagement and momentum

**Complexity Level**: Light Application (multiple features with basic state)
The dashboard manages user preferences, learning progress, and assessment data while maintaining simplicity through well-organized sections and clear visual hierarchy.

## Essential Features

### Multi-Step Onboarding
- **Functionality**: Collects user skills, goals, preferences, and accessibility needs across 4 steps
- **Purpose**: Creates personalized learning experience foundation
- **Trigger**: First-time user visits or profile reset
- **Progression**: Skills input → Goals definition → Coaching preferences → Accessibility options → Dashboard
- **Success criteria**: Complete profile enables personalized learning path generation

### Learning Path Dashboard
- **Functionality**: Visual timeline showing L100→L200→L300 progression with status indicators
- **Purpose**: Provides clear roadmap and maintains motivation through visible progress
- **Trigger**: User completes onboarding or returns to dashboard
- **Progression**: View current position → Identify next milestone → Access learning materials → Track completion
- **Success criteria**: Users can identify current status and next steps within 5 seconds

### Assessment System
- **Functionality**: Multiple choice quizzes and hands-on tasks with detailed feedback
- **Purpose**: Validates learning and identifies knowledge gaps for targeted improvement
- **Trigger**: Milestone completion or scheduled assessment
- **Progression**: Select assessment → Complete questions/tasks → Receive feedback → Review recommendations
- **Success criteria**: Feedback includes specific strengths and actionable improvement suggestions

### Shadow Opportunities Panel
- **Functionality**: Displays relevant internal projects with responsible PJMs and application process
- **Purpose**: Connects theoretical learning with practical experience opportunities
- **Trigger**: User reaches intermediate skill level or browses opportunities
- **Progression**: Browse opportunities → Review requirements → Apply to shadow → Connect with PJM
- **Success criteria**: Clear project descriptions and straightforward application process

### Mentorship Matching
- **Functionality**: Shows mentor profiles with skills, availability, and request system
- **Purpose**: Facilitates human connection and personalized guidance
- **Trigger**: User seeks mentorship or reaches specific milestones
- **Progression**: Browse mentors → Review profiles → Send request → Establish connection
- **Success criteria**: Successful mentor-mentee connections with clear communication channels

## Edge Case Handling
- **Incomplete Onboarding**: Save progress and allow resumption at any step
- **No Available Mentors**: Show waitlist option and suggest alternative resources
- **Assessment Failures**: Provide remedial learning paths and encouragement
- **Accessibility Conflicts**: Graceful fallbacks when accessibility features conflict
- **Empty Learning Paths**: Show placeholder content and path generation status

## Design Direction
The interface should feel professional yet approachable, mirroring Microsoft's Fluent design language with subtle depth, gentle animations, and clean typography that builds confidence in the learning journey.

## Color Selection
Triadic color scheme balancing professional credibility with motivational energy.

- **Primary Color**: Microsoft Blue (oklch(0.6 0.15 250)) - Trust and professionalism for main actions
- **Secondary Colors**: Soft Gray (oklch(0.95 0.01 250)) for backgrounds, Deep Blue (oklch(0.3 0.12 250)) for text
- **Accent Color**: Success Green (oklch(0.7 0.15 140)) for progress indicators and achievements
- **Foreground/Background Pairings**: 
  - Background (Soft White oklch(0.98 0.01 250)): Dark Blue text (oklch(0.25 0.08 250)) - Ratio 12.5:1 ✓
  - Primary (Microsoft Blue): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Accent (Success Green): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Card (Pure White oklch(1 0 0)): Dark Blue text (oklch(0.25 0.08 250)) - Ratio 13.8:1 ✓

## Font Selection
Segoe UI font family conveys Microsoft's professional, accessible, and modern design philosophy while ensuring excellent readability across all devices.

- **Typographic Hierarchy**:
  - H1 (Dashboard Title): Segoe UI Semibold/32px/tight letter spacing
  - H2 (Section Headers): Segoe UI Semibold/24px/normal letter spacing  
  - H3 (Card Titles): Segoe UI Medium/18px/normal letter spacing
  - Body (Content Text): Segoe UI Regular/16px/relaxed line height
  - Caption (Metadata): Segoe UI Regular/14px/muted color

## Animations
Subtle micro-interactions enhance usability without distraction, using gentle easing and purposeful motion that feels natural and responsive.

- **Purposeful Meaning**: Smooth transitions communicate progress flow and state changes
- **Hierarchy of Movement**: Progress indicators receive prominent animation, form interactions get subtle feedback, navigation uses smooth slides

## Component Selection
- **Components**: Card for content sections, Progress for learning paths, Button variants for different action types, Dialog for assessments, Avatar for mentors, Badge for skills/status, Tabs for dashboard sections, Select/Input for forms, Slider for time preferences
- **Customizations**: Custom progress timeline component, specialized assessment cards with feedback panels, mentor profile cards with availability indicators
- **States**: Buttons show clear hover/active/disabled states, progress elements animate on updates, form fields provide inline validation feedback
- **Icon Selection**: Phosphor icons for consistency - GraduationCap for learning, Target for goals, Clock for time, Users for mentorship, ChartLine for progress
- **Spacing**: Consistent 4/6/8/12/16/24px spacing using Tailwind scale for visual rhythm
- **Mobile**: Responsive grid that stacks vertically on mobile, collapsible sidebar becomes bottom navigation, touch-friendly button sizes (minimum 44px)