'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  X,
  Check,
  Zap,
  Crown,
  Building2,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts'
import { toast } from 'sonner'

// Simulated token usage data
const usageData = [
  { day: 'Mon', tokens: 1200 },
  { day: 'Tue', tokens: 1800 },
  { day: 'Wed', tokens: 2400 },
  { day: 'Thu', tokens: 1600 },
  { day: 'Fri', tokens: 3200 },
  { day: 'Sat', tokens: 800 },
  { day: 'Sun', tokens: 2100 },
]

const monthlyData = [
  { month: 'Jan', tokens: 8500 },
  { month: 'Feb', tokens: 12000 },
  { month: 'Mar', tokens: 9800 },
  { month: 'Apr', tokens: 15200 },
  { month: 'May', tokens: 18000 },
  { month: 'Jun', tokens: 14500 },
]

interface Plan {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  price: string
  priceMonthly: number
  description: string
  features: string[]
  tokenLimit: string
  icon: typeof Zap
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceMonthly: 0,
    description: 'For personal exploration',
    features: ['10,000 tokens/month', 'GPT-4 Mini access', 'Basic support', '5 chats/day'],
    tokenLimit: '10K',
    icon: Zap,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    priceMonthly: 19,
    description: 'For professionals & creators',
    features: [
      '100,000 tokens/month',
      'GPT-5 & Claude access',
      'Priority support',
      'Unlimited chats',
      'File uploads',
      'Custom instructions',
    ],
    tokenLimit: '100K',
    icon: Crown,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    priceMonthly: 49,
    description: 'For teams & organizations',
    features: [
      '1,000,000 tokens/month',
      'All models access',
      'Dedicated support',
      'Unlimited everything',
      'API access',
      'Custom fine-tuning',
      'Team management',
    ],
    tokenLimit: '1M',
    icon: Building2,
  },
]

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { user, updatePlan } = useAuth()
  const [upgrading, setUpgrading] = useState<string | null>(null)

  const handleUpgrade = async (plan: Plan) => {
    if (plan.id === user?.plan) return
    setUpgrading(plan.id)

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1500))

    updatePlan(plan.id)
    setUpgrading(null)
    toast.success(`Successfully ${plan.priceMonthly > 0 ? 'upgraded' : 'switched'} to ${plan.name} plan`)
  }

  const usagePercent = user ? Math.round((user.tokensUsed / user.tokenLimit) * 100) : 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden mx-4 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close settings"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-65px)]">
          <Tabs defaultValue="usage" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="bg-secondary w-full">
                <TabsTrigger value="usage" className="flex-1 text-xs">Usage</TabsTrigger>
                <TabsTrigger value="subscription" className="flex-1 text-xs">Subscription</TabsTrigger>
                <TabsTrigger value="account" className="flex-1 text-xs">Account</TabsTrigger>
              </TabsList>
            </div>

            {/* Usage Tab */}
            <TabsContent value="usage" className="px-6 pb-6">
              <div className="flex flex-col gap-6 mt-4">
                {/* Usage summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tokens Used</span>
                    <span className="text-lg font-semibold text-foreground font-mono">
                      {user?.tokensUsed.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Token Limit</span>
                    <span className="text-lg font-semibold text-foreground font-mono">
                      {user?.tokenLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Usage</span>
                    <span className="text-lg font-semibold text-foreground font-mono">
                      {usagePercent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Monthly usage</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {usagePercent}% of limit
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercent > 80 ? 'bg-destructive' : 'bg-foreground/60'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Weekly chart */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Weekly Token Usage</span>
                  </div>
                  <div className="h-48 bg-secondary rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: '#888', fontSize: 11 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: '#888', fontSize: 11 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="tokens" fill="#888" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly trend */}
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-foreground">Monthly Trend</span>
                  <div className="h-40 bg-secondary rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: '#888', fontSize: 11 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: '#888', fontSize: 11 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="tokens"
                          stroke="#888"
                          fill="rgba(136,136,136,0.15)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="px-6 pb-6">
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                  <span className="text-xs text-muted-foreground">Current plan:</span>
                  <span className="text-xs font-semibold text-foreground capitalize">{user?.plan}</span>
                </div>

                <div className="grid gap-4">
                  {plans.map(plan => {
                    const isCurrentPlan = user?.plan === plan.id
                    const PlanIcon = plan.icon

                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-xl border p-5 transition-all ${
                          isCurrentPlan
                            ? 'border-foreground/30 bg-secondary/50'
                            : plan.popular
                            ? 'border-foreground/15 hover:border-foreground/25'
                            : 'border-border hover:border-foreground/15'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-medium bg-foreground text-background rounded-full">
                            Most Popular
                          </span>
                        )}

                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-lg bg-accent flex items-center justify-center">
                              <PlanIcon className="size-5 text-foreground" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                              <p className="text-xs text-muted-foreground">{plan.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-foreground">{plan.price}</span>
                            {plan.priceMonthly > 0 && (
                              <span className="text-xs text-muted-foreground">/mo</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 mt-4">
                          {plan.features.map(feature => (
                            <div key={feature} className="flex items-center gap-1.5">
                              <Check className="size-3 text-foreground/60 shrink-0" />
                              <span className="text-xs text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className={`w-full mt-4 h-9 text-xs font-medium ${
                            isCurrentPlan
                              ? 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
                              : 'bg-foreground text-background hover:bg-foreground/90'
                          }`}
                          disabled={isCurrentPlan || !!upgrading}
                          onClick={() => handleUpgrade(plan)}
                        >
                          {upgrading === plan.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : isCurrentPlan ? (
                            'Current Plan'
                          ) : (
                            `${plan.priceMonthly > (plans.find(p => p.id === user?.plan)?.priceMonthly || 0) ? 'Upgrade' : 'Switch'} to ${plan.name}`
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="px-6 pb-6">
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-medium text-foreground">Profile</h3>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Name</span>
                      <span className="text-sm text-foreground">{user?.name}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Email</span>
                      <span className="text-sm text-foreground">{user?.email}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Member since</span>
                      <span className="text-sm text-foreground">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Plan</span>
                      <span className="text-sm text-foreground capitalize">{user?.plan}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-medium text-foreground">Preferences</h3>
                  <div className="bg-secondary rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-foreground">Dark Mode</span>
                        <p className="text-[10px] text-muted-foreground">Always use dark theme</p>
                      </div>
                      <div className="size-5 rounded-full bg-foreground flex items-center justify-center">
                        <Check className="size-3 text-background" />
                      </div>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-foreground">Stream Responses</span>
                        <p className="text-[10px] text-muted-foreground">Show typing animation</p>
                      </div>
                      <div className="size-5 rounded-full bg-foreground flex items-center justify-center">
                        <Check className="size-3 text-background" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs h-9"
                >
                  Delete Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
