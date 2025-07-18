"use client"

import { useEffect, useState } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AdminNav } from '@/components/admin-nav'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface Member {
  id: string
  name: string
  email?: string
  phone?: string
  level: '管理員' | 'VIP' | '一般會員'
  points: number
  created_at: string
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [levelDraft, setLevelDraft] = useState<{ [id: string]: Member['level'] }>({})
  const [editMember, setEditMember] = useState<Member | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', password: '', level: '一般會員' as Member['level'] })
  const [editLoading, setEditLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/members/all')
      const data = await res.json()
      setMembers(data)
    } catch (e) {
      toast({ title: '錯誤', description: '無法載入會員資料', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleLevelChange = (id: string, newLevel: Member['level']) => {
    setLevelDraft(prev => ({ ...prev, [id]: newLevel }))
  }

  const handleSaveLevel = async (id: string) => {
    const newLevel = levelDraft[id]
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: newLevel })
      })
      if (!res.ok) throw new Error('更新失敗')
      toast({ title: '成功', description: '會員等級已更新' })
      setEditingId(null)
      fetchMembers()
    } catch (e) {
      toast({ title: '錯誤', description: '會員等級更新失敗', variant: 'destructive' })
    }
  }

  const openEdit = (m: Member) => {
    setEditMember(m)
    setEditForm({ name: m.name, email: m.email || '', phone: m.phone || '', password: '', level: m.level })
  }
  const closeEdit = () => {
    setEditMember(null)
    setEditForm({ name: '', email: '', phone: '', password: '', level: '一般會員' })
  }
  const handleEditChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }
  const handleEditSave = async () => {
    if (!editMember) return
    setEditLoading(true)
    try {
      const body: any = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        level: editForm.level
      }
      if (editForm.password) body.password = editForm.password
      const res = await fetch(`/api/members/${editMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('更新失敗')
      toast({ title: '成功', description: '會員資料已更新' })
      closeEdit()
      fetchMembers()
    } catch (e) {
      toast({ title: '錯誤', description: '會員資料更新失敗', variant: 'destructive' })
    } finally {
      setEditLoading(false)
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('刪除失敗')
      toast({ title: '成功', description: '會員已刪除' })
      setDeleteId(null)
      fetchMembers()
    } catch (e) {
      toast({ title: '錯誤', description: '會員刪除失敗', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">會員管理</h1>
        <Card>
          <CardHeader>
            <CardTitle>會員列表</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">載入中...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left">姓名</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">手機</th>
                      <th className="px-3 py-2 text-left">等級</th>
                      <th className="px-3 py-2 text-left">點數</th>
                      <th className="px-3 py-2 text-left">註冊時間</th>
                      <th className="px-3 py-2 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className="border-b">
                        <td className="px-3 py-2">{m.name}</td>
                        <td className="px-3 py-2">{m.email || '-'}</td>
                        <td className="px-3 py-2">{m.phone || '-'}</td>
                        <td className="px-3 py-2">
                          {editingId === m.id ? (
                            <Select value={levelDraft[m.id] || m.level} onValueChange={v => handleLevelChange(m.id, v as Member['level'])}>
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="一般會員">一般會員</SelectItem>
                                <SelectItem value="VIP">VIP</SelectItem>
                                <SelectItem value="管理員">管理員</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span>{m.level}</span>
                          )}
                        </td>
                        <td className="px-3 py-2">{m.points}</td>
                        <td className="px-3 py-2">{new Date(m.created_at).toLocaleDateString('zh-TW')}</td>
                        <td className="px-3 py-2">
                          {editingId === m.id ? (
                            <Button size="sm" onClick={() => handleSaveLevel(m.id)}>儲存</Button>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => {
                                setEditingId(m.id)
                                setLevelDraft(prev => ({ ...prev, [m.id]: m.level }))
                              }}>調整等級</Button>
                              <Dialog open={!!editMember && editMember.id === m.id} onOpenChange={v => v ? openEdit(m) : closeEdit()}>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="ml-2" onClick={() => openEdit(m)}>編輯</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader><DialogTitle>編輯會員</DialogTitle></DialogHeader>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">姓名</label>
                                      <Input value={editForm.name} onChange={e => handleEditChange('name', e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Email</label>
                                      <Input value={editForm.email} onChange={e => handleEditChange('email', e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">手機號碼</label>
                                      <Input value={editForm.phone} onChange={e => handleEditChange('phone', e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">新密碼（留空不變更）</label>
                                      <Input type="password" value={editForm.password} onChange={e => handleEditChange('password', e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">等級</label>
                                      <Select value={editForm.level} onValueChange={v => handleEditChange('level', v)}>
                                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="一般會員">一般會員</SelectItem>
                                          <SelectItem value="VIP">VIP</SelectItem>
                                          <SelectItem value="管理員">管理員</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button className="w-full mt-2" onClick={handleEditSave} disabled={editLoading}>{editLoading ? '儲存中...' : '儲存'}</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog open={deleteId === m.id} onOpenChange={v => v ? setDeleteId(m.id) : setDeleteId(null)}>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => setDeleteId(m.id)}>刪除</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>確定要刪除此會員？</AlertDialogTitle></AlertDialogHeader>
                                  <AlertDialogDescription>此操作無法復原，會員資料將永久刪除。</AlertDialogDescription>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(m.id)}>確定刪除</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 