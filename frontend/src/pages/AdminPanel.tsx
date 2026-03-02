import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Users, BarChart3, FileText, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAdminGetAllUsers } from '../hooks/useQueries';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_USAGE_DATA = [
  { day: 'Mon', sessions: 45 },
  { day: 'Tue', sessions: 62 },
  { day: 'Wed', sessions: 38 },
  { day: 'Thu', sessions: 71 },
  { day: 'Fri', sessions: 55 },
  { day: 'Sat', sessions: 89 },
  { day: 'Sun', sessions: 43 },
];

const PRACTICE_MODES = [
  { value: 'daily', label: 'Daily Conversation' },
  { value: 'interview', label: 'Interview Mode' },
  { value: 'group', label: 'Group Discussion' },
  { value: 'rrbssc', label: 'RRB/SSC Mode' },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useAdminGetAllUsers();
  const [scriptMode, setScriptMode] = useState('daily');
  const [scriptContent, setScriptContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveScript = async () => {
    if (!scriptContent.trim()) {
      toast.error('Please enter script content');
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success('Script saved successfully!');
    setScriptContent('');
  };

  const formatDate = (time: bigint) => {
    try {
      return new Date(Number(time) / 1_000_000).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-deep-purple text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard' })}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Shield className="w-7 h-7 text-violet-400" />
              Admin Panel
            </h1>
            <p className="text-white/60 mt-1">Manage users, scripts, and view analytics</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white/10 border border-white/10 rounded-xl p-1">
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="scripts" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60">
              <FileText className="w-4 h-4 mr-2" />
              Scripts
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold">All Users</h2>
                <p className="text-white/50 text-sm">{users?.length || 0} registered users</p>
              </div>
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 bg-white/10 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/60">Name</TableHead>
                        <TableHead className="text-white/60">Email</TableHead>
                        <TableHead className="text-white/60">XP</TableHead>
                        <TableHead className="text-white/60">Streak</TableHead>
                        <TableHead className="text-white/60">Role</TableHead>
                        <TableHead className="text-white/60">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users && users.length > 0 ? (
                        users.map((user, i) => (
                          <TableRow key={i} className="border-white/10 hover:bg-white/5">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell className="text-white/60">{user.email || '—'}</TableCell>
                            <TableCell className="text-yellow-400">{Number(user.xp).toLocaleString()}</TableCell>
                            <TableCell className="text-orange-400">{Number(user.streak)}🔥</TableCell>
                            <TableCell>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${user.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/60'}`}>
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell className="text-white/50">{formatDate(user.createdAt)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-white/40 py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-2">Weekly Sessions</h2>
              <p className="text-white/50 text-sm mb-6">Practice sessions over the last 7 days</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_USAGE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
                    <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a0533', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                    />
                    <Bar dataKey="sessions" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: 'Total Sessions', value: '403', color: 'text-violet-400' },
                  { label: 'Avg per Day', value: '57.6', color: 'text-cyan-400' },
                  { label: 'Peak Day', value: 'Saturday', color: 'text-pink-400' },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card rounded-xl p-4 border border-white/10 text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Scripts Tab */}
          <TabsContent value="scripts">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-2">Conversation Scripts</h2>
              <p className="text-white/50 text-sm mb-6">Add or edit starter prompts for each practice mode</p>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <Label className="text-white/80 mb-2 block">Practice Mode</Label>
                  <Select value={scriptMode} onValueChange={setScriptMode}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-purple border-white/20">
                      {PRACTICE_MODES.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value} className="text-white hover:bg-white/10">
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/80 mb-2 block">Script Content</Label>
                  <Textarea
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    placeholder="Enter the AI conversation starter or script for this mode..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl min-h-32"
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleSaveScript}
                  disabled={isSaving || !scriptContent.trim()}
                  className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-semibold h-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Script'
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
