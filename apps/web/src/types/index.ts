export interface User {
  id: string
  email: string
  username: string
  fullName: string
  role: 'teacher' | 'student'
}

export interface Process {
  id: string
  title: string
  description: string
  status: 'active' | 'archived' | 'draft'
  teacherId: string
  createdAt: string
}

export interface Lesson {
  id: string
  processId: string
  title: string
  description: string
  lessonType: 'website' | 'pdf'
  contentUrl: string
  orderIndex: number
}

export interface AuthResponse {
  accessToken: string
  user: User
}
