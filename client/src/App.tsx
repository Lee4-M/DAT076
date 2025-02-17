import './App.css'

import { Sidebar } from './Sidebar'
import { HelpSettings } from './HelpSettings'
import { BudgetTable } from './BudgetTable'

import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Container fluid className="d-flex bg-body-secondary gap-3 min-vh-100 w-100">
      <Sidebar />
      <BudgetTable />
      <HelpSettings />
    </Container>
  )
}

export default App
