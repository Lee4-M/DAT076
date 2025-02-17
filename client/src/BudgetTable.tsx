import { Table } from "react-bootstrap";
import { Budget } from "./api";
import './App.css'
import { BudgetComponent } from "./BudgetComponent";

interface BudgetTableProps {
    budgets: Budget[];
}

export function BudgetTable({ budgets }: BudgetTableProps) {
    return (
        <section className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped bordered hover className="p-2 table-striped text-center">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="pb-0">
                                <div className="w-75 m-auto py-2">Budget</div>
                            </th>
                            <th className="pb-0">
                                <div className="w-75 m-auto py-2">Expense</div>
                            </th>
                            <th className="pb-0">
                                <div className="w-75 m-auto py-2">Result</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((budget, index) => (
                            <BudgetComponent key={index} budget={budget} />
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="p-4 m-2 rounded text-center d-flex fw-bold justify-content-between text-white" id="total-row">
                <div className="flex-fill">Total</div>
                <div className="flex-fill">3900 :-</div>
                <div className="flex-fill">1800 :-</div>
                <div className="flex-fill">2100 :-</div>
            </div>
        </section>
    )
}