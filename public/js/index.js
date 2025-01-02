// Fetch transaction data from server that was passed through index.ejs
const transactions = window.transactions;

/**
 * Calculates and updates the display of financial totals
 * Updates the UI elements showing balance, income, expenses, and withdrawals
 */
function calculateTotals() {
    // Initialize counters for different financial metrics
    let balance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalWithdrawals = 0;

    // Loop through each transaction and update totals based on transaction type
    transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        
        // Update appropriate total based on transaction type
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

    // Update the UI with formatted currency values
    document.getElementById('total-balance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('total-withdrawals').textContent = `$${totalWithdrawals.toFixed(2)}`;
}

/**
 * Refreshes the dashboard data by fetching latest transactions
 * Updates the transaction list and recalculates totals
 */
async function refreshPage() {
    try {
        // Fetch HTML
        const response = await fetch('/dashboard', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache' // Prevent caching to ensure fresh data
            }
        });
        
        const html = await response.text();
        // Parse the HTML string into a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract new transactions data from the script tag
        const newTransactionsScript = doc.querySelector('script');
        if (newTransactionsScript) {
            // Use regex to find the transactions array in the script content
            const match = newTransactionsScript.textContent.match(/transactions = (\[.*?\]);/);
            if (match) {
                // Update the transactions array with new data
                transactions.length = 0; // Clear existing data
                const newTransactions = JSON.parse(match[1]);
                newTransactions.forEach(t => transactions.push(t));
            }
        }

        // Update the transaction list in the UI
        const newTransactionList = doc.querySelector('#transaction-list');
        const currentTransactionList = document.querySelector('#transaction-list');
        if (newTransactionList && currentTransactionList) {
            currentTransactionList.innerHTML = newTransactionList.innerHTML;
        }

        // Recalculate totals and reattach event listeners
        calculateTotals();
        attachEditListeners();
    } catch (error) {
        console.error('Error refreshing page:', error);
        showToast('Error refreshing data', 'error');
    }
}

/**
 * Attaches click event listeners to all edit buttons
 * Sets up form with transaction data when edit button is clicked
 */
function attachEditListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Get transaction details from button's data attributes
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            const amount = this.getAttribute('data-amount');
            const description = this.getAttribute('data-description');

            // Populate the form with transaction details
            document.getElementById('transaction-id').value = id;
            document.getElementById('type').value = type;
            document.getElementById('amount').value = amount;
            document.getElementById('description').value = description;

            // Show cancel button and notification
            document.getElementById('cancel-edit').style.display = 'inline';
            showToast('Editing transaction...', 'success');
        });
    });
}


// Handles the deletion of a transaction
 
async function handleDelete(event, transactionId) {
    event.preventDefault();
    
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    try {
        // Send delete request to server
        const response = await fetch(`/transactions/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete transaction');
        }

        // Show success message and refresh the page
        showToast('Transaction deleted successfully', 'success');
        setTimeout(refreshPage, 300); // Small delay before refresh
    } catch (error) {
        showToast(error.message || 'An error occurred while deleting the transaction', 'error');
    }
}

// Calculates savings distribution based on monthly income and percentages
function calculateSavings() {
    // Get values from input fields
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
    const emergencyPercent = parseFloat(document.getElementById('emergency-fund').value) || 0;
    const longTermPercent = parseFloat(document.getElementById('long-term-savings').value) || 0;
    const disposablePercent = parseFloat(document.getElementById('disposable-income').value) || 0;

    // Ensure percentages add up to 100%
    const totalPercentage = emergencyPercent + longTermPercent + disposablePercent;
    if (totalPercentage !== 100) {
        showToast('Percentages must add up to 100%', 'error');
        return;
    }

    // Calculate dollar amounts for each category
    const emergencyAmount = (monthlyIncome * emergencyPercent / 100).toFixed(2);
    const longTermAmount = (monthlyIncome * longTermPercent / 100).toFixed(2);
    const disposableAmount = (monthlyIncome * disposablePercent / 100).toFixed(2);

    // Update the display with calculated amounts
    document.getElementById('emergency-fund-amount').textContent = `$${emergencyAmount}`;
    document.getElementById('long-term-amount').textContent = `$${longTermAmount}`;
    document.getElementById('disposable-amount').textContent = `$${disposableAmount}`;

    // Show the results section
    document.querySelector('.results').style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculations
    calculateTotals();
    attachEditListeners();

    // Form submission handler
    document.getElementById('transaction-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const id = document.getElementById('transaction-id').value;
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;

        // Check if there's enough balance for withdrawals
        if (type === 'withdraw') {
            const currentBalance = parseFloat(document.getElementById('total-balance').textContent.replace('$', ''));
            if (amount > currentBalance) {
                showToast('Insufficient balance for withdrawal', 'error');
                return;
            }
        }

        try {
            // Send POST/PUT request to server
            const response = await fetch(id ? `/transactions/${id}` : '/transactions', {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, amount, description })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Transaction failed');
            }

            // Show success message and reset form
            showToast(id ? 'Transaction updated successfully' : 'Transaction added successfully', 'success');
            this.reset();
            document.getElementById('cancel-edit').style.display = 'none';
            setTimeout(refreshPage, 300);
        } catch (error) {
            showToast(error.message || 'An error occurred while processing your request', 'error');
        }
    });

    // Cancel edit button handler
    document.getElementById('cancel-edit').addEventListener('click', function() {
        document.getElementById('transaction-id').value = '';
        document.getElementById('transaction-form').reset();
        this.style.display = 'none';
        showToast('Edit cancelled', 'error');
    });

    // Refresh totals button handler
    document.getElementById('refresh-totals').addEventListener('click', () => {
        location.reload(); // Reload the entire page
    });

    // Percentage input handlers
    const percentageInputs = ['emergency-fund', 'long-term-savings', 'disposable-income'];
    percentageInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            // Calculate total of all percentage inputs
            let total = 0;
            percentageInputs.forEach(inputId => {
                total += parseFloat(document.getElementById(inputId).value) || 0;
            });
            
            // Adjust current input if total exceeds 100%
            if (total > 100) {
                this.value = parseFloat(this.value) - (total - 100);
            }
        });
    });

    // Check if CSS is loaded
    const styles = document.styleSheets;
    let cssLoaded = false;
    for (let i = 0; i < styles.length; i++) {
        if (styles[i].href && styles[i].href.includes('index.css')) {
            cssLoaded = true;
            console.log('CSS loaded successfully');
            break;
        }
    }
    if (!cssLoaded) {
        console.error('CSS file not loaded properly');
    }
});
