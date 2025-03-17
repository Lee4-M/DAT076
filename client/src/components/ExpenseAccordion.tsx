import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { deleteExpense, Expense, updateExpenses } from "../api/api";

import '../routes/App.css';
import ExpenseModal from "./ExpenseModal";
import { DraggableExpense } from "./DraggableExpense";
import { useDroppable } from "@dnd-kit/core";


interface ExpenseAccordionProps {
    budgetId: number; 
    expenses: Expense[];
    deleteBudget: (id: number) => void;  
    loadExpenses: () => void;
    loadBudgets: () => void;
    handleClose: () => void;
}

export function ExpenseAccordion({ expenses, handleClose, loadExpenses, loadBudgets, deleteBudget, budgetId}: ExpenseAccordionProps) {
    const {setNodeRef, isOver} = useDroppable({
            id: budgetId.toString(),
            data: { id: budgetId },
          });
    const tbodyStyle = {
            backgroundColor: isOver ? "#e0e0e0" : "transparent", 
            transition: "background-color 0.2s ease-in-out, transform 0.15s ease-in-out", 
            borderRadius: "8px",
        };
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [editedExpenses, setEditedExpenses] = useState<Expense[]>(expenses);
    const [isEditing, setIsEditing] = useState(false);
    
    async function handleDeleteExpense(id: number) {
        const success = await deleteExpense(id);
        if (success) {
            console.log("Expense deleted, reloading expenses...");
            loadExpenses();
        } else {
            console.log("Failed to delete expense");
        }
    }

    async function handleSaveExpenses() {
        setIsEditing(!isEditing);
        if (isEditing) {
            const ids = editedExpenses.map(expense => expense.id);
            const costs = editedExpenses.map(expense => expense.cost);
            const descriptions = editedExpenses.map(expense => expense.description);
    
            await updateExpenses(ids, costs, descriptions);
            await loadExpenses();
        }
    }
    
    async function handleChangeExpenses(id: number, changes: Partial<Expense>) {
        setEditedExpenses(prevExpenses =>
            prevExpenses.map(expense =>
                expense.id === id ? { ...expense, ...changes } : expense
            )  
        );
    }

    useEffect(() => {
        setEditedExpenses(expenses);
    }, [expenses]);

    return (
        <section ref={setNodeRef} style={tbodyStyle}>
            {expenses.length === 0 ? (
                // If there are no expenses
                <div className="text-center p-3">
                    <p>No expenses available</p>
                    <button onClick={() => setShowExpenseModal(true)} className=" expense-row-btn ">
                        Add Expense +
                    </button>
                </div>
            ) : (
                // Show when there are existing expenses
                <Table className="p-2 expense-table" >
                    <thead>
                        <tr>
                            <th>Cost</th>
                            <th>Description</th>

                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <DraggableExpense 
                                key={expense.id} 
                                expense={expense} 
                                editedExpenses={editedExpenses}
                                isEditing={isEditing} 
                                handleChangeExpenses={handleChangeExpenses} 
                                handleSaveExpenses={handleSaveExpenses}
                                handleDeleteExpense={handleDeleteExpense} 
                            />
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="d-flex justify-content-between p-3">
                {/* Left-side buttons: Delete & Edit */}
                <div className="d-flex gap-2">
                    <button
                        onClick={async () => {
                            await deleteBudget(budgetId);
                            handleClose();
                        }}
                        className="delete-budget-btn"
                    >
                        <img src="/images/trash-delete-budget.svg" alt="Delete" width="15" height="15" />
                        Delete Budget
                    </button>

                    {expenses.length > 0 && (
                        <button
                            onClick={() => handleSaveExpenses()}
                            className={`edit-budget-btn ${isEditing ? "editing-mode" : ""}`}
                        >
                            <img src="/images/edit-budget.svg" alt="Edit" width="15" height="15" />
                            {isEditing ? "Done" : "Edit expenses"}
                        </button>
                    )}
                </div>

                <button onClick={handleClose} className="close-budget-btn">
                    <img src="/images/arrow-up.svg" alt="Close" width="15" height="15" />
                    Close
                </button>
            </div>

            <ExpenseModal 
                show={showExpenseModal} 
                handleClose={() => setShowExpenseModal(false)} 
                onSave={() => {
                    setShowExpenseModal(false);
                    loadExpenses();
                    loadBudgets();
                }} 
            />
        </section>
    );
}

export default ExpenseAccordion;
