
import Activity from '@/components/Activity/Activity'
import VerificationGuard from '@/components/guards/VerificationGuard'
import React from 'react'

const ActivityPage = () => {
  return (
    <div>
      <VerificationGuard>
      <Activity />
      </VerificationGuard>
      </div>
  )
}

export default ActivityPage