import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTask } from '../context/TaskContext'
import Button from '../components/common/Button'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      padding: 20, borderRadius: 12,
      backgroundColor: 'var(--color-surface-container-lowest)',
      border: '1px solid var(--color-outline-variant)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-on-surface-variant)', margin: 0 }}>{label}</p>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          backgroundColor: color + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color }}>{icon}</span>
        </div>
      </div>
      <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-on-surface)', margin: 0, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { tasks } = useTask()
  const navigate = useNavigate()

  const total = tasks.length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const completed = tasks.filter(t => t.status === 'done').length

  return (
    <div className="page-scroll" style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="text-display-lg" style={{ color: 'var(--color-on-surface)', margin: '0 0 6px' }}>
            Good {getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p style={{ fontSize: 15, color: 'var(--color-on-surface-variant)', margin: 0 }}>
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stat cards — responsive grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          <StatCard icon="task_alt"    label="Total Tasks" value={total}      color="var(--color-primary)" />
          <StatCard icon="pending"     label="In Progress"  value={inProgress} color="var(--color-secondary)" />
          <StatCard icon="check_circle" label="Completed"   value={completed}  color="var(--color-surface-tint)" />
        </div>

        {/* CTA card */}
        <div style={{
          padding: 24, borderRadius: 12,
          backgroundColor: 'var(--color-surface-container-lowest)',
          border: '1px solid var(--color-outline-variant)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div>
            <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)', margin: '0 0 4px' }}>
              Jump back in
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Your Q3 Product Launch board has {inProgress} task{inProgress !== 1 ? 's' : ''} in progress.
            </p>
          </div>
          <Button variant="solid" icon="view_kanban" onClick={() => navigate('/boards')}>
            Go to Board
          </Button>
        </div>
      </div>
    </div>
  )
}
