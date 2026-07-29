import { useNavigate } from 'react-router-dom'

export default function BoardCard({ board }) {
  const navigate = useNavigate()
  const createdDate = new Date(board.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div onClick={() => navigate(`/boards/${board.id}`)}
         className="p-3.5 rounded-lg cursor-pointer transition-all duration-150  border  ">
      <div className="text-[13.5px] font-semibold text-[var(--color-text)]">
        {board.name}
      </div>
      <div className="mt-1 text-[12px] text-[var(--color-text-subtle)]">
        Created {createdDate}
      </div>
    </div>
  )
}