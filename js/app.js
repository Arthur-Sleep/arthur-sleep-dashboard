// Main application logic
function renderCustomerCard(customer) {
    const coveragePercent = calculateCoveragePercentage(customer.coverage);
    const valueTier = getValueTier(customer.totalSpend);

    let shoeGridHTML = '';
    Object.entries(customer.coverage).forEach(([category, info]) => {
        const categoryData = shoeCategories[category];
        shoeGridHTML += `
            <div class="shoe-box ${info.owned ? 'owned' : 'not-owned'}" data-category="${category}">
                <span class="shoe-icon">${categoryData.icon}</span>
                <span class="shoe-name">${categoryData.name}</span>
                ${info.owned ? `<span class="tooltip">${info.model}</span>` : '<span class="tooltip">Not owned</span>'}
            </div>
        `;
    });

    return `
        <div class="customer-card" data-coverage="${coveragePercent}" data-value="${valueTier}">
            <div class="customer-header">
                <div>
                    <div class="customer-name">${customer.name}</div>
                    <div class="customer-info">${customer.email} • £${customer.totalSpend.toLocaleString()}</div>
                </div>
                <div style="text-align: right;">
                    <div class="coverage-percentage">${coveragePercent}%</div>
                    <div class="coverage-label">Coverage</div>
                </div>
            </div>
            <div class="shoe-grid">
                ${shoeGridHTML}
            </div>
            <div class="coverage-progress">
                <div class="coverage-progress-bar" style="width: ${coveragePercent}%"></div>
            </div>
            <div class="action-buttons">
                <button class="action-btn btn-primary" onclick="targetCustomer(${customer.id})">Target Gaps</button>
                <button class="action-btn btn-secondary" onclick="viewDetails(${customer.id})">View Details</button>
            </div>
        </div>
    `;
}

function renderCustomers(customersToShow = customers) {
    const grid = document.getElementById('customerGrid');
    grid.innerHTML = customersToShow.map(customer => renderCustomerCard(customer)).join('');
    
    // Update stats
    updateStats(customersToShow);
}

function updateStats(customersToShow) {
    document.getElementById('totalCustomers').textContent = customersToShow.length;
    
    const avgCoverage = customersToShow.reduce((sum, customer) => 
        sum + calculateCoveragePercentage(customer.coverage), 0) / customersToShow.length;
    document.getElementById('avgCoverage').textContent = Math.round(avgCoverage) + '%';
    
    const completeSets = customersToShow.filter(customer => 
        calculateCoveragePercentage(customer.coverage) === 100).length;
    document.getElementById('completeSets').textContent = completeSets;
    
    // Update category stats
    const categoryStats = {};
    Object.keys(shoeCategories).forEach(cat => {
        categoryStats[cat] = customersToShow.filter(c => c.coverage[cat]?.owned).length;
    });
    
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        const categories = ['business', 'casual', 'evening', 'travel'];
        if (index < categories.length) {
            const cat = categories[index];
            const count = categoryStats[cat] || 0;
            const percentage = Math.round((count / customersToShow.length) * 100);
            card.querySelector('.value').textContent = `${percentage}%`;
            card.querySelector('.sub-value').textContent = `${count} customers`;
        }
    });
}

function targetCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    const gaps = Object.entries(customer.coverage)
        .filter(([_, info]) => !info.owned)
        .map(([category, _]) => shoeCategories[category].name);
    
    // In production, this would trigger your marketing automation
    alert(`Marketing campaign created for ${customer.name}\nTargeting: ${gaps.join(', ')} categories\nEmail: ${customer.email}`);
}

function viewDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    // In production, this would navigate to customer detail page
    console.log('Customer details:', customer);
    alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nTotal Spend: £${customer.totalSpend}\nLast Purchase: ${customer.lastPurchase}`);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterCustomers);
    
    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterCustomers);
    });
    
    // Initial render
    renderCustomers();
});
