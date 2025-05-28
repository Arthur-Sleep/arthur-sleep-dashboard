// Customer data structure and sample data
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

// Sample customer data - replace with API call
let customers = [
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

// Generate sample data
function generateSampleCustomers(count) {
    for (let i = 3; i <= count; i++) {
        const coverage = {};
        Object.keys(shoeCategories).forEach(cat => {
            const owned = Math.random() > 0.5;
            const category = shoeCategories[cat];
            coverage[cat] = {
                owned: owned,
                model: owned ? category.models[Math.floor(Math.random() * category.models.length)] : null,
                purchaseDate: owned ? `2025-0${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null
            };
        });

        customers.push({
            id: i,
            name: `Customer ${i}`,
            email: `customer${i}@email.com`,
            totalSpend: Math.floor(Math.random() * 10000) + 500,
            lastPurchase: `2025-0${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            coverage: coverage
        });
    }
}

// Initialize with sample data
generateSampleCustomers(50);
