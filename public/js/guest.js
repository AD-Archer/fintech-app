// Configure toastr
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 3000
};

// Constants
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
let guestTransactions = [];

// Initialize and check storage
function initializeStorage() {
    try {
        const stored = localStorage.getItem('guestTransactions');
        if (stored) {
            guestTransactions = JSON.parse(stored);
            updateStorageUsage();
        }
    } catch (error) {
        showToast('Error loading saved transactions', 'error');
        guestTransactions = [];
    }
}

// Calculate storage usage
function updateStorageUsage() {
    const usage = new Blob([localStorage.getItem('guestTransactions')]).size;
    const percentage = (usage / MAX_STORAGE_SIZE) * 100;
    
    document.getElementById('storage-usage').textContent = `${percentage.toFixed(1)}%`;
    document.getElementById('storage-bar').style.width = `${percentage}%`;
    
    // Update progress bar color based on usage
    const bar = document.getElementById('storage-bar');
    if (percentage > 90) {
        bar.className = 'progress-bar bg-danger';
    } else if (percentage > 70) {
        bar.className = 'progress-bar bg-warning';
    } else {
        bar.className = 'progress-bar bg-success';
    }
}

// Check if adding new transaction would exceed storage limit
function checkStorageLimit(newTransaction) {
    const currentSize = new Blob([localStorage.getItem('guestTransactions')]).size;
    const newSize = new Blob([JSON.stringify([...guestTransactions, newTransaction])]).size;
    
    if (newSize > MAX_STORAGE_SIZE) {
        showToast('Storage limit reached! Please delete some transactions or register for an account.', 'error');
        return false;
    }
    return true;
}

function showToast(message, type = 'success') {
    toastr[type](message);
}

// Calculate totals function
function calculateTotals() {
    try {
        let balance = 0;
        let totalIncome = 0;
        let totalExpenses = 0;
        let totalWithdrawals = 0;

        guestTransactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            
            switch(transaction.type) {
                case 'income':
                    balance += amount;
                    totalIncome += amount;
                    break;
                case 'expense':
                    balance -= amount;
                    totalExpenses += amount;
                    break;
                case 'withdraw':
                    balance -= amount;
                    totalWithdrawals += amount;
                    break;
            }
        });

        document.getElementById('total-balance').textContent = `$${balance.toFixed(2)}`;
        document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('total-withdrawals').textContent = `$${totalWithdrawals.toFixed(2)}`;
    } catch (error) {
        showToast('Error calculating totals', 'error');
    }
}

// Handle form submission
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        // Create new transaction
        const newTransaction = {
            id: Date.now(),
            type,
            amount,
            description,
            date: new Date().toISOString()
        };

        // Check storage limit
        if (!checkStorageLimit(newTransaction)) {
            return;
        }

        // Add to transactions array
        guestTransactions.push(newTransaction);
        
        // Update localStorage
        try {
            localStorage.setItem('guestTransactions', JSON.stringify(guestTransactions));
            updateStorageUsage();
        } catch (error) {
            showToast('Error saving transaction', 'error');
            guestTransactions.pop(); // Remove the transaction if it couldn't be saved
            return;
        }
        
        // Update UI
        refreshTransactionList();
        calculateTotals();
        
        // Reset form
        this.reset();
        showToast('Transaction added successfully');
    } catch (error) {
        showToast('Error adding transaction', 'error');
    }
});

// Delete transaction
function handleDelete(transactionId) {
    try {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        guestTransactions = guestTransactions.filter(t => t.id !== transactionId);
        localStorage.setItem('guestTransactions', JSON.stringify(guestTransactions));
        updateStorageUsage();
        
        refreshTransactionList();
        calculateTotals();
        showToast('Transaction deleted successfully');
    } catch (error) {
        showToast('Error deleting transaction', 'error');
    }
}

// Refresh transaction list
function refreshTransactionList() {
    try {
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = '';

        if (guestTransactions.length === 0) {
            transactionList.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p class="mb-0">No transactions found</p>
                </div>
            `;
            return;
        }

        guestTransactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'list-group-item';
            transactionElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <div class="transaction-info">
                        <span class="badge rounded-pill type-${transaction.type}">
                            ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                        <span class="transaction-amount fw-bold">
                            $${transaction.amount.toFixed(2)}
                        </span>
                        ${transaction.description ? `
                            <div class="transaction-description">
                                ${transaction.description}
                            </div>
                        ` : ''}
                        <small class="text-muted">
                            ${new Date(transaction.date).toLocaleString()}
                        </small>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-outline-danger btn-sm delete-btn"
                                onclick="handleDelete(${transaction.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            transactionList.appendChild(transactionElement);
        });
    } catch (error) {
        showToast('Error refreshing transaction list', 'error');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    refreshTransactionList();
    calculateTotals();
}); 