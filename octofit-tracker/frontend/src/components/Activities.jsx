import { fetchPage, getUserName } from '../api'
import ResourceView from './ResourceView'

const loadActivities = (options) => fetchPage('/api/activities/', options)
const columns = [
  { label: 'Student', render: (record, _index, users) => getUserName(record.user, users) },
  { label: 'Activity', render: (record) => record.type },
  { label: 'Duration', render: (record) => `${record.duration} min` },
  { label: 'Date', render: (record) => record.date ? new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-' },
]

export default function Activities() {
  return <ResourceView title="Activities" fetch={loadActivities} columns={columns} resolveUsers />
}