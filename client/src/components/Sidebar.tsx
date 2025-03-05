import { useState } from "react";
import { Container, Row, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Budget } from "../api/api";
import { logout } from "../api/apiLogin";

import '../routes/App.css'
import ExpenseModal from "./ExpenseModal";
import BudgetItemModal from "./BudgetModal";
import { PieChart } from "@mui/x-charts";

interface SidebarProps {
    loadBudgets: () => void;
    budgets: Budget[];
}

export function Sidebar({ loadBudgets, budgets }: SidebarProps) {
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    // const totalExpenses = budgets.reduce((sum, budget) =>
    //     sum + budget.expenses.reduce((total, expense) => total + expense.cost, 0),
    //     0);

    // const expenseData = budgets.map(budget => {
    //     const categoryTotal = budget.expenses.reduce((total, expense) => total + expense.cost, 0);
    //     return {
    //         id: budget.category,
    //         value: totalExpenses > 0 ? parseFloat(((categoryTotal / totalExpenses) * 100).toFixed(1)) : 0,
    //         label: budget.category,
    //     };
    // });

    return (
        <Container className="bg-light-subtle rounded-3 h-100">
            <Row>
                <Image src="/images/Budgie_Logo.svg" alt="Budgie" className="img-fluid w-25 h-auto mx-auto d-block" />
            </Row>
            <Row className="px-3 pt-4">
                <button className="sidebar-button" onClick={() => setShowBudgetModal(true)}>Add budget</button>
            </Row>
            <Row className="px-3 pt-3">
                <button className="sidebar-button" onClick={() => setShowExpenseModal(true)}>Add expense</button>
            </Row>
            <Row className="px-3 py-3">
                <button className="sidebar-button">Edit expense</button>
            </Row>
            {/* <Row className="p-3">
                <Card className="d-flex justify-content-center align-items-center">
                    <PieChart data-testid="pie-chart"
                        series={[
                            {
                                data: expenseData.map((item) => ({
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                })),
                                innerRadius: 140,
                                outerRadius: 0,
                                cornerRadius: 3,
                                paddingAngle: 1,
                                cx: 200,
                                valueFormatter: item => `${item.value}%`,
                                highlightScope: { fade: 'global', highlight: 'item' },
                                faded: { innerRadius: 100, additionalRadius: -10, color: 'gray' },
                            },
                        ]}
                        slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' } } }}
                        width={400}
                        height={450}
                    />
                </Card>
            </Row> */}
            <Row className="p-3">
                <button className="sidebar-button" onClick={handleLogout}>Sign out</button>
            </Row>
            <ExpenseModal show={showExpenseModal} handleClose={() => setShowExpenseModal(false)} onSave={() => {
                setShowExpenseModal(false);
                loadBudgets();
            }} />
            <BudgetItemModal show={showBudgetModal} handleClose={() => setShowBudgetModal(false)} onSave={() => {
                setShowBudgetModal(false);
                loadBudgets();
            }}
            />
        </Container>
    )
}