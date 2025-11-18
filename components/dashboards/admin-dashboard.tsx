'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllUsers, User } from '@/lib/auth'
import { getDocuments } from '@/lib/storage'

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    verifiedDocuments: 0,
  })

  useEffect(() => {
    const allUsers = getAllUsers()
    const allDocs = getDocuments()
    setUsers(allUsers)
    setStats({
      totalUsers: allUsers.length,
      totalDocuments: allDocs.length,
      pendingDocuments: allDocs.filter(d => d.status === 'pending').length,
      verifiedDocuments: allDocs.filter(d => d.status === 'verified').length,
    })
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Administration Dashboard</h2>
        <p className="text-foreground/60">Manage users, view system statistics, and monitor document flow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="text-foreground/60 text-sm mb-2">Total Users</div>
          <div className="text-4xl font-bold text-primary">{stats.totalUsers}</div>
        </Card>
        <Card className="p-6 border-border/50 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="text-foreground/60 text-sm mb-2">Total Documents</div>
          <div className="text-4xl font-bold text-accent">{stats.totalDocuments}</div>
        </Card>
        <Card className="p-6 border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
          <div className="text-foreground/60 text-sm mb-2">Pending Verification</div>
          <div className="text-4xl font-bold text-yellow-600">{stats.pendingDocuments}</div>
        </Card>
        <Card className="p-6 border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
          <div className="text-foreground/60 text-sm mb-2">Verified Documents</div>
          <div className="text-4xl font-bold text-green-600">{stats.verifiedDocuments}</div>
        </Card>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="text-xl font-bold text-foreground">System Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5 border-b border-border/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/30 hover:bg-secondary/5">
                  <td className="px-6 py-3 text-sm text-foreground">{user.name}</td>
                  <td className="px-6 py-3 text-sm text-foreground/70">{user.email}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-primary/20 text-primary' :
                      user.role === 'officer' ? 'bg-accent/20 text-accent' :
                      'bg-secondary/20 text-secondary'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-foreground/60">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
