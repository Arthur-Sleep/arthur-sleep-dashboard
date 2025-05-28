// Customer data and configuration
let customers = [];

const shoeCategories = {
    business: {
        name: 'Business',
        icon: '👔',
        models: ['Caledonian', 'Pablo']
    },
    casual: {
        name: 'Weekend', 
        icon: '👟',
        models: ['Castro', 'Raf Sneaker', 'Kilim']
    },
    evening: {
        name: 'Evening',
        icon: '🎭', 
        models: ['Velvet Slipper', 'Amarantos']
    },
    travel: {
        name: 'Travel',
        icon: '✈️',
        models: ['Travel Mule']
    },
    special: {
        name: 'Special',
        icon: '⭐',
        models: ['Custom Monk-strap', 'Exotic Caledonian']
    }
};

// Function to process CSV data
function processShopifyCSV(csvText) {
    // Parse CSV - this is a simple parser, you might need to adjust based on your CSV format
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Find column indexes
    const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
    const firstNameIndex = headers.findIndex(h => h.toLowerCase().includes('first') && h.toLowerCase().includes('name'));
    const lastNameIndex = headers.findIndex(h => h.toLowerCase().includes('last') && h.toLowerCase().includes('name'));
    const totalSpentIndex = headers.findIndex(h => h.toLowerCase().includes('total') && h.toLowerCase().includes('spent'));
    const lastOrderIndex = headers.findIndex(h => h.toLowerCase().includes('last') && h.toLowerCase().includes('order'));
    
    customers = [];
    
    // Process each customer
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        const email = values[emailIndex];
        const firstName = values[firstNameIndex] || '';
        const lastName = values[lastNameIndex] || '';
        const totalSpent = parseFloat(values[totalSpentIndex]) || 0;
        const lastOrder = values[lastOrderIndex] || '';
        
        if (email) {
            customers.push({
                id: i,
                name: `${firstName} ${lastName}`.trim() || 'Unknown Customer',
                email: email,
                totalSpend: totalSpent,
                lastPurchase: lastOrder,
                coverage: generateRandomCoverage() // We'll update this with real data later
            });
        }
    }
    
    console.log(`Loaded ${customers.length} customers from CSV`);
    renderCustomers();
}

// For now, generate random coverage - you'll update this with real order data
function generateRandomCoverage() {
    const coverage = {};
    Object.keys(shoeCategories).forEach(cat => {
        const owned = Math.random() > 0.6; // 40% chance of owning each category
        const category = shoeCategories[cat];
        coverage[cat] = {
            owned: owned,
            model: owned ? category.models[0] : null,
            purchaseDate: owned ? '2025-01-01' : null
        };
    });
    return coverage;
}

// Add sample customers for testing
function addSampleCustomers() {
    customers = [
        {
            id: 1,
            name: "James Thompson",
            email: "james.t@email.com",
            totalSpend: 6250,
            lastPurchase: "2025-05-15",
            coverage: {
                business: { owned: true, model: "Caledonian", purchaseDate: "2024-03-15" },
                casual: { owned: true, model: "Castro", purchaseDate: "2024-01-20" },
                evening: { owned: false },
                travel: { owned: true, model: "Travel Mule", purchaseDate: "2025-05-15" },
                special: { owned: false }
            }
        },
        {
            id: 2,
            name: "Sarah Mitchell",
            email: "sarah.m@email.com",
            totalSpend: 3200,
            lastPurchase: "2025-04-22",
            coverage: {
                business: { owned: true, model: "Caledonian", purchaseDate: "2025-02-10" },
                casual: { owned: true, model: "Raf Sneaker", purchaseDate: "2025-04-22" },
                evening: { owned: true, model: "Velvet Slipper", purchaseDate: "2025-03-18" },
                travel: { owned: false },
                special: { owned: false }
            }
        }
    ];
    
    // Add more sample customers
    for (let i = 3; i <= 20; i++) {
        customers.push({
            id: i,
            name: `Customer ${i}`,
            email: `customer${i}@email.com`,
            totalSpend: Math.floor(Math.random() * 5000) + 500,
            lastPurchase: '2025-05-01',
            coverage: generateRandomCoverage()
        });
    }
}

// Initialize with sample data
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...');
    addSampleCustomers();
    renderCustomers();
    console.log('Dashboard loaded with sample data');
});
