import { Link } from 'next-view-transitions'
import Card from './Card'

function NotFound() {
  return (
    <div className="not_found">
      <h1>404</h1>
      <div>This page is missing ......</div>
      <Card active>
        <Link href="/">Back to Home</Link>
      </Card>
    </div>
  )
}

export default NotFound
