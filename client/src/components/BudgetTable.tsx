import { Table } from "react-bootstrap";
import { useState } from "react";
import { Budget, Expense } from "../api/api";
import { BudgetRowComponent } from "./BudgetRowComponent";
import BudgetItemModal from "./BudgetModal";

//Annelie

interface BudgetTableProps {
    budgets: Budget[];
  
    loadBudgets: () => void;
    expenses: { [budget_id: number]: Expense[] };
    loadExpenses: () => void;
    updateBudgetCost: (id: number, category: string, amount: number) => void;
    isEditing: boolean;
}

export function BudgetTable({ budgets, loadBudgets, expenses, loadExpenses, updateBudgetCost, isEditing }: BudgetTableProps) {

    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
    const totalExpenses = Object.values(expenses).flat().reduce((total, expense) => total + expense.cost, 0);
    const result = totalBudget - totalExpenses;

    const [showBudgeteModal, setShowBudgetModal] = useState(false);

    const [sortStates, setSortStates] = useState<{ [key: string]: boolean | null }>({
        Budget: null,
        Expense: null,
        Result: null
    });

    //TEMPORARY: Replace with sort function
    const handleSort = (column: string) => {
        setSortStates((prevState) => ({
            ...prevState,
            [column]: prevState[column] === null ? true : !prevState[column]
        }));
        console.log(`Sorting by: ${column}`);
    };


    const getSortIcon = (column: string) => {
        if (sortStates[column] === null) return "/images/Filter-Base.svg"; 
        return sortStates[column] ? "/images/Filter-Up.svg" : "/images/Filter-Down.svg";
    };


    

    return (
        <section className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped  className="budget-table p-2  text-center">
                    <thead>
                        <tr>
                            <th>
                                <div className="m-auto py-2">Category</div>
                            </th>
                            <th>
                                <div onClick={() => handleSort("Budget")}  className="w-75 m-auto py-2">Budget 
                                <img 
                                        src={getSortIcon("Budget")} 
                                        alt="Sort" 
                                        width="15" 
                                        height="15" 
                                        className="ms-1"
                                    />


                                </div>
                            </th>
                            <th>
                                <div onClick={() => handleSort("Expense")} className="w-75 m-auto py-2">Expense
                                <img 
                                        src={getSortIcon("Expense")} 
                                        alt="Sort" 
                                        width="15" 
                                        height="15" 
                                        className="ms-1"
                                    />

                                </div>
                            </th>
                            <th>
                                <div onClick={() => handleSort("Result")} className="w-75 m-auto py-2">Result
                                <img 
                                        src={getSortIcon("Result")} 
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
                            budgets.map(budget => (
                                <BudgetRowComponent
                                    key={budget.id} 
                                    budget={budget}
                                    loadBudgets={loadBudgets}
                                    loadExpenses={loadExpenses}
                                    expenses={expenses[budget.id] || []}
                                    isEditing={isEditing} 
                                    updateBudgetCost={updateBudgetCost}
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
