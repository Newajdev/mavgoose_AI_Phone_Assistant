import { Icon } from '@iconify/react'
import cn from "../libs/cn"

export default function DashboardStatus({title, value, parsent, icone, styls}) {
  return (
    <div className='bg-[#0F172B80] border-2 border-[#2B7FFF33] inline-flex items-start justify-between p-8 gap-2 rounded-2xl'>
        <div>
            <p className='text-[#90A1B9] text-sm'>{title}</p>
            <h4 className='text-white text-3xl mt-2 mb-4'>{value}</h4>
            <h5 className={`${parsent <= 10 ? "text-red-500":"text-green-600"}`}>+{parsent}%</h5>
        </div>
        <div className={cn("p-3.5 rounded-[14px] bg-linear-to-tr", styls)}>
            <Icon icon={icone} width={24} height={24}/>
        </div>
    </div>
  )
}
