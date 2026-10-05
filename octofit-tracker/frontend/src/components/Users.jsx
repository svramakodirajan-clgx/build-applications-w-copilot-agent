import { fetchPage } from '../api'
import ResourceView from './ResourceView'

const loadUsers = (options) => fetchPage('/api/users/', options)
const columns = [
  { label: 'Student', render: (record) => record.name },
  { label: 'Joined', render: (record) => record.createdAt ? new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-' },
]

export default function Users() {
  return <ResourceView title="Users" fetch={loadUsers} columns={columns} />
}