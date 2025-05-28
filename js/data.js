// Shopify Storefront API Configuration
const SHOPIFY_DOMAIN = 'your-store.myshopify.com'; // Replace with your store
const STOREFRONT_ACCESS_TOKEN = 'YOUR_STOREFRONT_ACCESS_TOKEN'; // From Shopify

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
    // Show loading state
    document.getElementById('customerGrid').innerHTML = '<p>Loading customers from Shopify...</p>';
    
    // Load customers
    customers = await loadShopifyCustomers();
    
    // Render the dashboard
    renderCustomers();
});
Option B: Use a Server/Cloud Function (More Powerful)
For full access to customer data, you'll need a server. Here's a simple approach using Netlify Functions:

Create a new file netlify/functions/get-customers.js:

javascriptconst fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
    const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
    const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;

    try {
        // Fetch customers
        const customersResponse = await fetch(
            `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_DOMAIN}/admin/api/2024-01/customers.json?limit=250`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        const customersData = await customersResponse.json();
        
        // Fetch orders for each customer
        const customersWithOrders = await Promise.all(
            customersData.customers.map(async (customer) => {
                const ordersResponse = await fetch(
                    `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_DOMAIN}/admin/api/2024-01/customers/${customer.id}/orders.json`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
                
                const ordersData = await ordersResponse.json();
                
                // Process orders to determine coverage
                const coverage = processOrdersForCoverage(ordersData.orders);
                
                return {
                    id: customer.id,
                    name: `${customer.first_name} ${customer.last_name}`,
                    email: customer.email,
                    totalSpend: customer.total_spent,
                    lastPurchase: customer.last_order_date,
                    coverage: coverage
                };
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify(customersWithOrders)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

function processOrdersForCoverage(orders) {
    // Similar logic to calculate coverage
    // Implementation here...
}
