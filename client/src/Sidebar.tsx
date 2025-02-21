import { useState } from "react";
import { Col, Container, Row, Card, Image } from "react-bootstrap";
import ExpenseModal from "./ExpenseModal";
import BudgetItemModal from "./BudgetItemModal";
import { Budget } from "./api";

interface SidebarProps {
    addBudget: (budget: Budget) => void;
    loadBudgets: () => void;
}

export function Sidebar({ addBudget, loadBudgets }: SidebarProps) {
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    return (
        <Container className="bg-light-subtle rounded-3 h-100">
            <Row>
                <Image src="/images/Budgie_Logo.svg" alt="Budgie" className="img-fluid w-25 h-auto mx-auto d-block" />
            </Row>
            <Row className="px-3 pt-4">
                <button onClick={() => setShowBudgetModal(true)}>Add budget</button>
            </Row>
            <Row className="px-3 pt-3">
                <button onClick={() => setShowExpenseModal(true)}>Add expense</button>
            </Row>
            <Row className="px-3 py-3">
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

            <ExpenseModal show={showExpenseModal} handleClose={() => setShowExpenseModal(false)} onSave={() => {
                setShowExpenseModal(false);
                loadBudgets();
            }} />
            <BudgetItemModal show={showBudgetModal} handleClose={() => setShowBudgetModal(false)} onSave={(newBudget) => {
                addBudget(newBudget);
                setShowBudgetModal(false);
            }}
            />
        </Container>
    )
}