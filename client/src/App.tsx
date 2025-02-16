import { useState } from 'react'
import './App.css'
import { Sidebar } from './Sidebar'
import { HelpSettings } from './HelpSettings'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="d-flex">
      <Sidebar />

      <HelpSettings />
    </Container>
  )
}

export default App
