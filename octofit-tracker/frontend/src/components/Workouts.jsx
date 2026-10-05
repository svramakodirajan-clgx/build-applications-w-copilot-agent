import { fetchPage } from '../api'
import ResourceView from './ResourceView'

const loadWorkouts = (options) => fetchPage('/api/workouts/', options)
const columns = [
  { label: 'Workout', render: (record) => record.name },
  { label: 'Description', render: (record) => record.description || '-' },
  { label: 'Duration', render: (record) => `${record.duration} min` },
]

export default function Workouts() {
  return <ResourceView title="Workouts" fetch={loadWorkouts} columns={columns} />
}