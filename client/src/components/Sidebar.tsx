import { useEffect, useRef, useState } from "react";
import { Container, Row, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Budget, Expense } from "../api/api";
import { logout } from "../api/apiLogin";
import { updateBudgetRows } from '../api/api';

import '../routes/App.css'
import ExpenseModal from "./ExpenseModal";
import BudgetItemModal from "./BudgetModal";
import { PieChart } from "@mui/x-charts";

interface SidebarProps {
    loadBudgets: () => void,
    expenses: {
        [budget_id: number]: Expense[];
    },
    onSave: () => void,
    isEditing: boolean,
    budgets: Budget[],
}

export function Sidebar({ loadBudgets, expenses, onSave, isEditing, budgets}: SidebarProps) {
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    // useEffect(() => {
    //     setEditedBudgets(budgets);
    // }, [budgets]);

    // useEffect(() => {
    //     if (isEditing) {
    //         window.addEventListener("keydown", handleKeyDown);
    //     } else {
    //         window.removeEventListener("keydown", handleKeyDown);
    //     }
        
    //     return () => window.removeEventListener("keydown", handleKeyDown);
    // }, [isEditing]);

    
    // // Allows user to press enter to save changes
    // const handleKeyDown = async (e: KeyboardEvent) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         console.log("Before saving enter, editedBudgets =", editedBudgets);
    //         await handleEdit();
    //         console.log("After saving enter, editedBudgets =", editedBudgets);
    //     }
    // };

    // const handleEdit = async () => {
    //     setIsEditing(!isEditing);
    //     //console.log(isEditing);
    //     if (isEditing) {
    //         await updateBudgetRows(editedBudgets);
    //         await loadBudgets();
    //     }
    // };
    
    const expenseData = Object.entries(expenses).map(([budgetRowId, expenseList]) => {
        const budget = budgets.find(b => b.id === Number(budgetRowId));
        return {
            id: Number(budgetRowId),
            value: expenseList.reduce((sum, expense) => sum + expense.cost, 0),
            label: budget ? budget.category : 'Unknown'
        };
    });

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
                <button className="sidebar-button" onClick={(onSave)}>{isEditing ? "Save changes" : "Edit budget"}</button>
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