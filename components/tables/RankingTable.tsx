import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface RankItem {
  id: string
  name: string
  score: number
  samples: number
  type: string
}

interface RankingTableProps {
  title: string
  description: string
  data: RankItem[]
  linkPrefix: string
  limit?: number
}

export function RankingTable({ title, description, data, linkPrefix, limit = 10 }: RankingTableProps) {
  // 1. Deduplicate items by ID to prevent key collision crashes
  const uniqueData = data.filter(
    (item, index, self) => self.findIndex((t) => t.id === item.id) === index
  )

  // 2. Slice the cleaned data up to the requested limit
  const topItems = uniqueData.slice(0, limit)

  return (
    <div className="card-elevated p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-[--clr-text-secondary]">{description}</p>
      </div>

      <div className="overflow-x-auto mb-4 flex-grow">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[--clr-border] text-[--clr-text-muted]">
              <th className="py-2 px-3 font-medium">Rank</th>
              <th className="py-2 px-3 font-medium">Name</th>
              <th className="py-2 px-3 font-medium">Score</th>
              <th className="py-2 px-3 font-medium hidden sm:table-cell">Samples</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, index) => (
              /* item.id is now safe to use as a unique key */
              <tr 
                key={item.id} 
                className="border-b border-[--clr-border] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                <td className="py-2.5 px-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-[#f5a524] text-black' :
                    index === 1 ? 'bg-[#c0c0c0] text-black' :
                    index === 2 ? 'bg-[#cd7f32] text-black' :
                    'bg-[--clr-bg-elevated] text-[--clr-text-secondary]'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-medium text-[--clr-text-primary]">
                  {/* Link to programmatic SEO page */}
                  <Link href={`/${linkPrefix}/${item.id}`} className="hover:text-[--clr-accent] hover:underline">
                    {item.name}
                  </Link>
                </td>
                <td className="py-2.5 px-3 text-[--clr-accent] font-mono">{item.score.toFixed(1)}</td>
                <td className="py-2.5 px-3 text-[--clr-text-muted] hidden sm:table-cell">{item.samples.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-[--clr-border]">
        <Link
          href={`/${linkPrefix}`}
          className="text-sm text-[--clr-accent] hover:underline flex items-center justify-center gap-1 w-full p-2"
        >
          View Full Ranking List <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}
