/**
 * BudgetTable component is responsible for rendering the table containing the budgets 
 * and related expenses.
 * 
 * Features: 
 * - Displays budgets and associated expenses.
 * - Interactive sorting by: category name, budget amount, expense amount and result (budget amount - expense amount).
 * - Drag and drop expenses between budgets. 
 * - Summary rows of totals and remaining budget.
 * 
 * @component
 * @param budgets - The budget objects containing category and amount.
 * @param expenses - The list of expenses related to the budget.
 * @param isEditing - Flag to determine if the budget row is in editing mode.
 * @param loadBudgets - Function to reload the budgets.
 * @param loadExpenses - Function to reload the expenses.
 * @param handleChangeBudgets - Function to handle changes to the budget.
 * @param handleSaveBudgetRows - Function to save the budget rows.
 */

import { Table } from "react-bootstrap";
import { useState } from "react";
import { Budget, Expense, updateExpense } from "../api/api";
import { BudgetRowComponent } from "./BudgetRowComponent";
import BudgetItemModal from "./BudgetModal";
import _ from "lodash";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

interface BudgetTableProps {
    budgets: Budget[];
    expenses: { [budget_id: number]: Expense[] };
    isEditing: boolean;
    loadBudgets: () => void;
    loadExpenses: () => void;
    handleChangeBudgets: (id: number, changes: Partial<Budget>) => void;
    handleSaveBudgetRows: () => void;
}

export function BudgetTable({ budgets, expenses,  isEditing, loadBudgets, loadExpenses, handleChangeBudgets, handleSaveBudgetRows }: BudgetTableProps) {
    const [sortBy, setSortBy] = useState<string>('category');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
    const totalExpenses = Object.values(expenses).flat().reduce((total, expense) => total + expense.cost, 0);
    const result = totalBudget - totalExpenses;

    const [showBudgetModal, setShowBudgetModal] = useState(false);

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return "/images/Filter-Base.svg"; 
        if (sortOrder === 'asc') return "/images/Filter-Up.svg";
        return "/images/Filter-Down.svg";
    };

    const handleSort = (field: string) => {
        const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newSortOrder);
    };

    const sortedBudgets = isEditing ? budgets : _.orderBy(budgets, [budget => {
        if (sortBy === 'totalExpenses') {
            return expenses[budget.id]?.reduce((total, expense) => total + expense.cost, 0) || 0;
        } else if (sortBy === 'result') {
            const totalExpenses = expenses[budget.id]?.reduce((total, expense) => total + expense.cost, 0) || 0;
            return budget.amount - totalExpenses;
        } else {
            return budget[sortBy as keyof Budget];
        }
    }], [sortOrder]);
    	
    async function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;

        const expenseId = active.data.current.id; 
        const newBudgetId = over.data.current.id;

        const expense = Object.values(expenses).flat().find(e => e.id === expenseId);
        if (!expense || expense.budgetRowId === newBudgetId) return; 

        await updateExpense(expenseId, expense.cost, expense.description, newBudgetId);
        await loadExpenses();
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 50, 
                tolerance: 5,
            },
        })
    );

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <section role="main" className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
                <div className="flex-grow-1 overflow-auto table-responsive">
                    <Table striped data-testid="budget-table" className="budget-table p-2  text-center">
                        <thead>
                            <tr>
                                <th scope="col" className="budget-table-header">
                                    <div onClick={() => handleSort("category")} className="m-auto py-2">Category
                                        <img 
                                                src={getSortIcon("category")} 
                                                alt="Sort" 
                                                width="15" 
                                                height="15" 
                                                className="ms-1"
                                            />
                                    </div>
                                </th>
                                <th scope="col" className="budget-table-header">
                                    <div onClick={() => handleSort("amount")}  className="m-auto py-2">Budget 
                                    <img 
                                            src={getSortIcon("amount")} 
                                            alt="Sort" 
                                            width="15" 
                                            height="15" 
                                            className="ms-1"
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="budget-table-header">
                                    <div onClick={() => handleSort("totalExpenses")} className="m-auto py-2">Expense
                                        <img 
                                                src={getSortIcon("totalExpenses")} 
                                                alt="Sort" 
                                                width="15" 
                                                height="15" 
                                                className="ms-1"
                                            />
                                    </div>
                                </th>
                                <th scope="col" className="budget-table-header">
                                    <div onClick={() => handleSort("result")} className="m-auto py-2">Result
                                        <img 
                                                src={getSortIcon("result")} 
                                                alt="Sort" 
                                                width="15" 
                                                height="15" 
                                                className="ms-1"
                                            />
                                    </div>
                                </th>
                                <th scope="col">
                                    </th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-3">
                                        <p>Create Your First Budget!</p>
                                        <button onClick={() => setShowBudgetModal(true)} className="expense-row-btn">Add Budget +</button>
                                    </td>
                                </tr>
                            ) : (
                                sortedBudgets.map((budget, index) => (
                                    <BudgetRowComponent
                                        key={index}
                                        budget={budget}
                                        loadBudgets={loadBudgets}
                                        loadExpenses={loadExpenses}
                                        expenses={expenses[budget.id] || []}
                                        isEditing={isEditing} 
                                        handleChangeBudgets={handleChangeBudgets} 
                                        handleSaveBudgetRows={handleSaveBudgetRows}
                                    />
                                ))
                            )}

                        </tbody>
                    </Table>
                </div>

                <div data-testid="total-row" className="p-4 m-2 rounded text-center d-flex fw-bold justify-content-between text-white" id="total-row">
                    <div className="flex-fill blue-contrast-text">Total</div>
                    <div className="flex-fill blue-contrast-text">{totalBudget} :-</div>
                    <div className="flex-fill blue-contrast-text">{totalExpenses} :-</div>
                    <div className="flex-fill blue-contrast-text">{result} :-</div>
                </div>

                <BudgetItemModal show={showBudgetModal} handleClose={() => setShowBudgetModal(false)} onSave={loadBudgets} />
            
            </section>
        </DndContext>
    );
}
