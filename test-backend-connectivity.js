/**
 * Backend Connectivity Test Script
 * Tests API endpoints to verify backend is running correctly
 */

import http from 'http';

const API_BASE_URL = 'http://localhost:5000';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        }

        const req = http.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body, headers: res.headers });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║   Backend Connectivity Test Suite     ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);

    let passed = 0;
    let failed = 0;

    // Test 1: Health Check
    console.log(`${colors.yellow}Test 1: Health Check${colors.reset}`);
    try {
        const response = await makeRequest('/health');
        if (response.status === 200) {
            console.log(`${colors.green}✓ Health check passed${colors.reset}`);
            console.log(`  Response: ${JSON.stringify(response.data)}\n`);
            passed++;
        } else {
            console.log(`${colors.red}✗ Health check failed - Status: ${response.status}${colors.reset}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`${colors.red}✗ Health check failed - Error: ${error.message}${colors.reset}\n`);
        failed++;
    }

    // Test 2: Get Products
    console.log(`${colors.yellow}Test 2: GET /api/products${colors.reset}`);
    try {
        const response = await makeRequest('/api/products?page=1&limit=5');
        if (response.status === 200 && response.data.products) {
            console.log(`${colors.green}✓ Products endpoint accessible${colors.reset}`);
            console.log(`  Found ${response.data.products.length} products (showing first 5)`);
            console.log(`  Total products: ${response.data.total || 'unknown'}\n`);
            passed++;
        } else {
            console.log(`${colors.red}✗ Products endpoint failed - Status: ${response.status}${colors.reset}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`${colors.red}✗ Products endpoint failed - Error: ${error.message}${colors.reset}\n`);
        failed++;
    }

    // Test 3: Login Endpoint
    console.log(`${colors.yellow}Test 3: POST /api/auth/login (Admin)${colors.reset}`);
    try {
        const response = await makeRequest('/api/auth/login', 'POST', {
            email: 'admin@mulary.com',
            password: 'admin123',
        });

        if (response.status === 200 && response.data.accessToken) {
            console.log(`${colors.green}✓ Admin login successful${colors.reset}`);
            console.log(`  User: ${response.data.user?.name || 'Unknown'}`);
            console.log(`  Role: ${response.data.user?.role || 'Unknown'}\n`);
            passed++;
        } else {
            console.log(`${colors.red}✗ Admin login failed - Status: ${response.status}${colors.reset}`);
            console.log(`  Response: ${JSON.stringify(response.data)}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`${colors.red}✗ Admin login failed - Error: ${error.message}${colors.reset}\n`);
        failed++;
    }

    // Test 4: Categories Endpoint
    console.log(`${colors.yellow}Test 4: GET /api/categories${colors.reset}`);
    try {
        const response = await makeRequest('/api/categories');
        if (response.status === 200) {
            console.log(`${colors.green}✓ Categories endpoint accessible${colors.reset}`);
            console.log(`  Found ${response.data.length || 0} categories\n`);
            passed++;
        } else {
            console.log(`${colors.red}✗ Categories endpoint failed - Status: ${response.status}${colors.reset}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`${colors.red}✗ Categories endpoint failed - Error: ${error.message}${colors.reset}\n`);
        failed++;
    }

    // Summary
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}Test Summary:${colors.reset}`);
    console.log(`  ${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${failed}${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);

    if (failed === 0) {
        console.log(`${colors.green}🎉 All tests passed! Backend is ready for frontend integration.${colors.reset}`);
        process.exit(0);
    } else {
        console.log(`${colors.red}⚠️  Some tests failed. Please check backend configuration.${colors.reset}`);
        process.exit(1);
    }
}

// Run tests
runTests().catch((error) => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
});
