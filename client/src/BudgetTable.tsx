import { Table } from "react-bootstrap";
import './App.css'

export function BudgetTable() {
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
                        <tr>
                            <td>Restaurant</td>
                            <td>2000 :-</td>
                            <td>1200 :-</td>
                            <td>800 :-</td>
                        </tr>
                        <tr>
                            <td>Transportation</td>
                            <td>1500 :-</td>
                            <td>100 :-</td>
                            <td>1400 :-</td>
                        </tr>
                        <tr>
                            <td>Subscriptions</td>
                            <td>400 :-</td>
                            <td>500 :-</td>
                            <td className="text-danger">-100 :-</td>
                        </tr>
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