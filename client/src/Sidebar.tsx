import { useState } from "react";
import { Col, Container, Row, Card, Image } from "react-bootstrap";
import ExpenseModal from "./ExpenseModal";

export function Sidebar() {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <Container className="bg-light-subtle rounded-3 h-100">
            <Row>
                <Image src="/images/Budgie_Logo.svg" alt="Budgie" className="img-fluid w-25 h-auto mx-auto d-block" />
            </Row>
            <Row className="p-3">
                <button onClick={handleShow}>Add expense</button>
            </Row>
            <Row className="p-3">
                <button>Edit expense</button>
            </Row>
            <Row>
                <Card className="p-3">
                    <Row>
                        <Image src="/images/pie-chart.png" alt="Pie chart" className="img-fluid w-75 h-auto mx-auto d-block" />
                    </Row>
                    <Row>
                        <Col>c11</Col>
                        <Col>c12</Col>
                    </Row>
                    <Row>
                        <Col>c21</Col>
                        <Col>c22</Col>
                    </Row>
                </Card>
            </Row>
            <Row className="p-3">
                <button>Sign out</button>
            </Row>
            <ExpenseModal show={showModal} handleClose={() => setShowModal(false)} />
        </Container>
    )
}