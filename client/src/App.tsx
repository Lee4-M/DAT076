import './App.css'

import { Sidebar } from './Sidebar'
import { HelpSettings } from './HelpSettings'
import { BudgetTable } from './BudgetTable'

import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Container fluid className="bg-body-secondary h-100 w-100">
      <Row className='h-100'>
        <Col lg="2" className='p-3'><Sidebar /></Col>
        <Col lg="9" className='p-3'><BudgetTable /></Col>
        <Col lg="1" className='p-0'><HelpSettings /></Col>
      </Row>
    </Container>
  )
}   

export default App
