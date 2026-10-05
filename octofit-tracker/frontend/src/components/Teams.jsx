import { fetchPage, getUserName } from '../api'
import ResourceView from './ResourceView'

const loadTeams = (options) => fetchPage('/api/teams/', options)
const columns = [
  { label: 'Team', render: (record) => record.name },
  { label: 'Members', render: (record, _index, users) => (record.members ?? []).map((member) => getUserName(member, users)).join(', ') || 'No members' },
  { label: 'Team Size', render: (record) => record.members?.length ?? 0 },
]

export default function Teams() {
  return <ResourceView title="Teams" fetch={loadTeams} columns={columns} resolveUsers />
}