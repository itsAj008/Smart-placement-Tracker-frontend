export type ApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected'

export type Application = {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
  deadline: string
  notes: string
  resumeName?: string
  createdAt: string
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
]
