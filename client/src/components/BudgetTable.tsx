import { Table } from "react-bootstrap";
import { useState } from "react";
import { Budget, Expense } from "../api/api";
import { BudgetRowComponent } from "./BudgetRowComponent";
import BudgetItemModal from "./BudgetModal";
import _ from "lodash";

interface BudgetTableProps {
    budgets: Budget[];
    loadBudgets: () => void;
    expenses: { [budget_id: number]: Expense[] };
    loadExpenses: () => void;
    isEditing: boolean;
    onEdit: (id: number, category: string, amount: number) => void;
    onSave: () => void;
}


export function BudgetTable({ budgets, loadBudgets, expenses, loadExpenses, onEdit, onSave, isEditing }: BudgetTableProps) {
    const [sortBy, setSortBy] = useState<string>('category');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
    const totalExpenses = Object.values(expenses).flat().reduce((total, expense) => total + expense.cost, 0);
    const result = totalBudget - totalExpenses;

    const [showBudgeteModal, setShowBudgetModal] = useState(false);

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

    const sortedBudgets = _.orderBy(budgets, [budget => {
        if (sortBy === 'totalExpenses') {
            return expenses[budget.id]?.reduce((total, expense) => total + expense.cost, 0) || 0;
        } else if (sortBy === 'result') {
            const totalExpenses = expenses[budget.id]?.reduce((total, expense) => total + expense.cost, 0) || 0;
            return budget.amount - totalExpenses;
        } else {
            return budget[sortBy as keyof Budget];
        }
    }], [sortOrder]);

    return (
        <section className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped  className="budget-table p-2  text-center">
                    <thead>
                        <tr>
                            <th>
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
                            <th>
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
                            <th>
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
                            <th>
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
                            <th>
                                </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center p-3">
                                    <p>Create Your First Budget!</p>
                                    <button onClick={() => setShowBudgetModal(true)} className="expense-row-btn">
                                        Add Budget +
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            sortedBudgets.map(budget => (
                                <BudgetRowComponent
                                    key={budget.id} 
                                    budget={budget}
                                    loadBudgets={loadBudgets}
                                    loadExpenses={loadExpenses}
                                    expenses={expenses[budget.id] || []}
                                    isEditing={isEditing} 
                                    onEdit={onEdit} 
                                    onSave={onSave}
                                />
                            ))
                        )}
                      
                    </tbody>
                </Table>
            </div>

            <div className="p-4 m-2 rounded text-center d-flex fw-bold justify-content-between text-white" id="total-row">
                <div className="flex-fill">Total</div>
                <div className="flex-fill">{totalBudget} :-</div>
                <div className="flex-fill">{totalExpenses} :-</div>
                <div className="flex-fill">{result} :-</div>
            </div>

            <BudgetItemModal show={showBudgeteModal} handleClose={() => setShowBudgetModal(false)} onSave={loadBudgets} />
        
        </section>
    );
}
