import { getDuration } from '@/lib/time'
import { Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
    <div
      className="footer"
      style={{
        textAlign: 'center',
        margin: '12px 0',
        padding: '13px 0',
        backgroundColor: '#fff',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
        }}
      >
        ©2022 - 2023 Plumbiu の 小屋
      </Typography>
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          fontSize: '12px',
        }}
      >
        {/* FIXME: server render */}
        本站已持续运作 {getDuration()}
      </Typography>
    </div>
  )
}

export default Footer
