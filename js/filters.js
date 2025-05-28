// Filtering functionality
function calculateCoveragePercentage(coverage) {
    const total = Object.keys(coverage).length;
    const owned = Object.values(coverage).filter(item => item.owned).length;
    return Math.round((owned / total) * 100);
}

function getValueTier(spend) {
    if (spend >= 5000) return 'vip';
    if (spend >= 2000) return 'high';
    if (spend >= 800) return 'medium';
    return 'standard';
}

function filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const coverageFilters = Array.from(document.querySelectorAll('.filter-checkbox:not(.category-filter):checked'))
        .map(cb => cb.value);
    const categoryFilters = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);
    
    const filtered = customers.filter(customer => {
        // Search filter
        if (searchTerm && !customer.name.toLowerCase().includes(searchTerm) && 
            !customer.email.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Coverage level filter
        const coverage = calculateCoveragePercentage(customer.coverage);
        let coverageMatch = false;
        coverageFilters.forEach(filter => {
            if (filter.includes('-')) {
                const [min, max] = filter.split('-').map(Number);
                if (coverage >= min && coverage <= max) {
                    coverageMatch = true;
                }
            } else if (filter.includes('vip') || filter.includes('high') || 
                      filter.includes('medium') || filter.includes('standard')) {
                // Value tier filter
                const tier = getValueTier(customer.totalSpend);
                if (tier === filter) {
                    coverageMatch = true;
                }
            }
        });
        if (coverageFilters.length > 0 && !coverageMatch) return false;
        
        // Missing category filter
        if (categoryFilters.length > 0) {
            const hasMissingCategory = categoryFilters.some(cat => 
                !customer.coverage[cat]?.owned
            );
            if (!hasMissingCategory) return false;
        }
        
        return true;
    });
    
    renderCustomers(filtered);
}

function exportData() {
    const filtered = Array.from(document.querySelectorAll('.customer-card')).map(card => {
        const name = card.querySelector('.customer-name').textContent;
        return customers.find(c => c.name === name);
    });
    
    let csv = 'Name,Email,Total Spend,Coverage %,Missing Categories\n';
    filtered.forEach(customer => {
        const coverage = calculateCoveragePercentage(customer.coverage);
        const missing = Object.entries(customer.coverage)
            .filter(([_, info]) => !info.owned)
            .map(([category, _]) => shoeCategories[category].name)
            .join('; ');
        
        csv += `"${customer.name}","${customer.email}",${customer.totalSpend},${coverage}%,"${missing}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arthur_sleep_coverage_gaps_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}
