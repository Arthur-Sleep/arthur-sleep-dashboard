// Shopify Storefront API Configuration
const SHOPIFY_DOMAIN = 'http://asleeptrading-co-uk.myshopify.com'; //
const STOREFRONT_ACCESS_TOKEN = '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&ie=UTF-8&oe=UTF-8'; //

// Product to Category Mapping
const productCategoryMap = {
    // Map your actual product IDs or handles to categories
    'caledonian-oxford': 'business',
    'pablo-loafer': 'business',
    'castro-suede': 'casual',
    'raf-sneaker': 'casual',
    'kilim-loafer': 'casual',
    'velvet-slipper': 'evening',
    'amarantos-heel': 'evening',
    'travel-mule': 'travel',
    'custom-monk-strap': 'special',
    'exotic-caledonian': 'special'
};

// Fetch customers from Shopify
async function loadShopifyCustomers() {
    try {
        // Note: Storefront API has limitations on customer data
        // You may need to use a server-side solution for full customer data
        
        const query = `
        {
            customers(first: 250) {
                edges {
                    node {
                        id
                        displayName
                        email
                        orders(first: 50) {
                            edges {
                                node {
                                    id
                                    totalPrice {
                                        amount
                                    }
                                    lineItems(first: 50) {
                                        edges {
                                            node {
                                                title
                                                variant {
                                                    product {
                                                        handle
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    createdAt
                                }
                            }
                        }
                    }
                }
            }
        }`;

        const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        
        // Transform Shopify data to our format
        const customers = data.data.customers.edges.map(edge => {
            const customer = edge.node;
            const orders = customer.orders.edges;
            
            // Calculate coverage based on orders
            const coverage = calculateCustomerCoverage(orders);
            const totalSpend = calculateTotalSpend(orders);
            
            return {
                id: customer.id,
                name: customer.displayName,
                email: customer.email,
                totalSpend: totalSpend,
                lastPurchase: orders[0]?.node.createdAt || null,
                coverage: coverage
            };
        });

        return customers;
    } catch (error) {
        console.error('Failed to load Shopify customers:', error);
        return [];
    }
}

// Calculate customer coverage from their orders
function calculateCustomerCoverage(orders) {
    const coverage = {
        business: { owned: false },
        casual: { owned: false },
        evening: { owned: false },
        travel: { owned: false },
        special: { owned: false }
    };

    orders.forEach(orderEdge => {
        const order = orderEdge.node;
        order.lineItems.edges.forEach(itemEdge => {
            const item = itemEdge.node;
            const productHandle = item.variant?.product?.handle;
            
            if (productHandle && productCategoryMap[productHandle]) {
                const category = productCategoryMap[productHandle];
                coverage[category] = {
                    owned: true,
                    model: item.title,
                    purchaseDate: order.createdAt
                };
            }
        });
    });

    return coverage;
}

// Calculate total spend
function calculateTotalSpend(orders) {
    return orders.reduce((total, orderEdge) => {
        const amount = parseFloat(orderEdge.node.totalPrice.amount);
        return total + amount;
    }, 0);
}

// Initialize when page loads
let customers = [];
document.addEventListener('DOMContentLoaded', async function() {
    document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state
    document.getElementById('customerGrid').innerHTML = '<p>Loading customers...</p>';
    
    // For now, use sample data to test search
    generateSampleCustomers(50);
    
    // Make sure customers array is populated
    console.log(`Loaded ${customers.length} customers`);
    
    // Render the dashboard
    renderCustomers();
    
    // Make sure search is connected
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        console.log('Search box found and connected');
    } else {
        console.error('Search box not found!');
    }
});
