import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/auth/authThunk.js'
import { useNavigate } from 'react-router-dom'
import ProfileAvatar from './ProfileAvatar.jsx'

export default function ProfileCard() {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => dispatch(logoutUser()).then(() => navigate('/login', { replace: true }))
  const rowCls = 'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)] transition-colors bg-transparent border-none cursor-pointer text-left'

  return (
    <div className="absolute right-0 z-50 !min-w-[20vw] min-h-[10vh] overflow-hidden bg-[#1F1F21] shadow-2xl shadow-white/20"
         style={{ top: 'calc(100% + 2px)' }}>
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[var(--color-hover)] "
           onClick={() => navigate('/profilePage')}>
        <div className="rounded-full overflow-hidden shrink-0 border-2 border-[var(--color-profile)]">
          <ProfileAvatar size={40} />
        </div>
        <div className="min-w-0">
          <p className="m-0 text-[14px] font-semibold text-[var(--color-text)] truncate">{user?.name}</p>
          <p className="m-0 text-[12px] text-[var(--color-text-subtle)] truncate">@{user?.username}</p>
        </div>
      </div>

      <hr className="border-t border-[var(--color-border)] " />

      <div className="p-2 flex flex-col gap-0.5">
        <p className="m-0 px-3 py-1 text-[12px] text-[var(--color-text-subtle)] truncate">{user?.email}</p>
        <div className="flex items-center gap-1.5 px-3 py-1">
          
          <span className={`text-[12px] ${user?.isVerified ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
            {user?.isVerified ? 'Verified' : 'Not Verified'}
          </span>
        </div>
      </div>

      

      <div className="p-2 flex flex-col gap-0.5">
        <button className={rowCls} onClick={() => navigate('/profilePage')}>
          
          My Profile
        </button>
        <button className={`${rowCls} text-[var(--color-error)] hover:text-[var(--color-error)]`} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}