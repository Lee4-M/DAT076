import { BudgetRowModel } from "./budgetRow.db";
import { ExpenseModel } from "./expense.db";

// Define associations after all models are imported
BudgetRowModel.hasMany(ExpenseModel, {
    foreignKey: "budgetRowId",
    as: "expenses",
    onDelete: "CASCADE",
});

ExpenseModel.belongsTo(BudgetRowModel, {
    foreignKey: "budgetRowId",
    onDelete: "CASCADE",
});