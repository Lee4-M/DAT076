import { Container, Table } from "react-bootstrap";
import './App.css'

export function BudgetTable() {
    return (
        <Container className="bg-light-subtle p-3 rounded d-flex flex-column">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped bordered hover className="table-striped text-center mb-0">
                    <thead>
                        <tr>
                            <th className="invisible"></th>
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

            <div className="mt-3 p-3 rounded text-center row fw-bold" id="total-row">
                <div className="col">Total</div>
                <div className="col">3900 :-</div>
                <div className="col">1800 :-</div>
                <div className="col">2100 :-</div>
            </div>
        </Container>
    )
}