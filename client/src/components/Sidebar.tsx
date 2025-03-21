/**
 * Sidebar component displays the sidebar navigation, allowing users to manage budgets and expenses.
 * 
 * Features:
 * - Allows users to add new budget items and expenses.
 * - Provides the option to edit and save changes to the budget. 
 * - Displays a pie chart summarizing the totatl expenses per budget category. 
 * - Includes a logout button to sign out the user. 
 * 
 * @component
 * @param budgets - List of all budgets.  
 * @param expenses - An object mapping budget Ids to their respective expenses.
 * @param isEditing - Boolean flag indicating whether or not the user is in editing mode. 
 * @param loadBudgets - Function to reload the list of budgets.
 * @param handleSaveBudgetRows - Function to save all changes made to the budgets.
 * 
 */
import { useMemo, useState } from "react";
import { Container, Row, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Budget, Expense } from "../api/api";
import { logout } from "../api/apiLogin";

import '../routes/App.css'
import ExpenseModal from "./ExpenseModal";
import BudgetItemModal from "./BudgetModal";
import { PieChart } from "@mui/x-charts";

interface SidebarProps {
    budgets: Budget[],
    expenses: {
        [budget_id: number]: Expense[];
    },
    isEditing: boolean,
    loadBudgets: () => void,
    handleSaveBudgetRows: () => void,
}

export function Sidebar({ budgets, expenses, isEditing, loadBudgets, handleSaveBudgetRows }: SidebarProps) {
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    const expenseData = useMemo(() =>
        Object.entries(expenses)
            .map(([budgetRowId, expenseList]) => {
                const budget = budgets.find(b => b.id === Number(budgetRowId));
                const totalCost = expenseList.reduce((sum, expense) => sum + (expense.cost || 0), 0);

                return {
                    id: isNaN(Number(budgetRowId)) ? -1 : Number(budgetRowId),
                    value: isNaN(totalCost) ? 0 : totalCost,
                    label: budget ? budget.category : "Unknown",
                };
            })
            .filter(item => item.id !== -1 && item.value > 0),
        [expenses, budgets]
    );

    return (
        <Container as="nav" data-testid="sidebar" className="bg-light-subtle rounded-3 h-100">
            <Row className="pt-4">
                <Image src="/images/Budgie_Logo.svg" alt="Budgie" className="img-fluid w-25 h-auto mx-auto d-block" />
            </Row>
            <Row className="px-3 pt-4">
                <button className="sidebar-button" onClick={() => setShowBudgetModal(true)}>Add budget</button>
            </Row>
            <Row className="px-3 pt-3">
                <button className="sidebar-button" onClick={() => setShowExpenseModal(true)}>Add expense</button>
            </Row>
            <Row className="px-3 py-3">
                <button className="sidebar-button" onClick={(handleSaveBudgetRows)}>{isEditing ? "Save changes" : "Edit budget"}</button>
            </Row>
            <Row className="p-3">
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
                                valueFormatter: item => `${item.value}`,
                                highlightScope: { fade: 'global', highlight: 'item' },
                                faded: { innerRadius: 100, additionalRadius: -10, color: 'gray' },
                            },
                        ]}
                        slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' } } }}
                        width={400}
                        height={450}
                    />
                </Card>
            </Row>
            <Row className="p-3">
                <button role="button" className="sidebar-button" onClick={handleLogout}>Sign out</button>
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