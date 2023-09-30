import '@/styles/loading.css'

const Skeleton = () => {
  return (
    <div className="skeleton-container">
      <div
        className="skeleton"
        style={{
          width: '40%',
        }}
      >
        <div />
      </div>
      <div
        className="skeleton"
        style={{
          width: '100%',
        }}
      >
        <div />
      </div>
      <div
        className="skeleton"
        style={{
          width: '80%',
        }}
      >
        <div />
      </div>
      <div
        className="skeleton"
        style={{
          width: '60%',
        }}
      >
        <div />
      </div>
    </div>
  )
}

export default Skeleton
