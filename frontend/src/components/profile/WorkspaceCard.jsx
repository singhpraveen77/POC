import { useNavigate } from 'react-router-dom'

export default function WorkspaceCard({ workspace }) {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/workspaces/${workspace.id}`)}
         className="p-3.5 rounded-lg cursor-pointer transition-all duration-150 !border !border-white">
      <div className="font-semibold text-[13.5px] ">
        {workspace.name}
      </div>
      <div className="mt-1 text-[12px]">
        {workspace.slug}
      </div>
    </div>
  )
}