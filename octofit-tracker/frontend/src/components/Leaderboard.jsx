import { fetchPage, getUserName } from '../api'
import ResourceView from './ResourceView'

const loadLeaderboard = (options) => fetchPage('/api/leaderboard/', options)
const columns = [
  { label: 'Rank', render: (_record, index) => index + 1 },
  { label: 'Student', render: (record, _index, users) => getUserName(record.user, users) },
  { label: 'Points', render: (record) => record.points },
]

export default function Leaderboard() {
  return <ResourceView title="Leaderboard" fetch={loadLeaderboard} columns={columns} resolveUsers />
}