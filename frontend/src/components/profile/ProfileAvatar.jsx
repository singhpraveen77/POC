import { useSelector } from 'react-redux'
export default function ProfileAvatar({ size = 100 }) {
  const user = useSelector(store => store.auth?.user)
  const name = user?.name
  const image = user?.profileImage
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || '?'
  if (image) {
    return (
      <div className="rounded-full overflow-hidden shrink-0"
           style={{ width: size, height: size, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    )
  }
  return (
    <div className="rounded-full flex items-center justify-center font-bold select-none overflow-hidden text-[var(--color-profile-text)] shrink-0"
         style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initial}
    </div>
  )
}