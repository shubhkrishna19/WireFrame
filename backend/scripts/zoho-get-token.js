/**
 * One-time script to exchange Zoho authorization code for refresh token
 * 
 * USAGE:
 * 1. Get authorization code from Zoho API Console
 * 2. Run: node scripts/zoho-get-token.js YOUR_AUTH_CODE
 * 3. Copy the refresh_token to your .env.local file
 */

const https = require('https');

// Your Zoho Self Client credentials
const CLIENT_ID = '1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA';
const CLIENT_SECRET = 'f60455449d30984ca1c026a872a2395cb5100dba36';

// Get auth code from command line
const AUTH_CODE = process.argv[2];

if (!AUTH_CODE) {
    console.log('\n❌ ERROR: Please provide authorization code\n');
    console.log('USAGE: node scripts/zoho-get-token.js YOUR_AUTH_CODE\n');
    console.log('To get the authorization code:');
    console.log('1. Go to https://api-console.zoho.com/');
    console.log('2. Select your Server-based Application');
    console.log('3. Click "Generate Code" tab');
    console.log('4. Enter scope: ZohoCRM.modules.ALL,ZohoBooks.fullaccess.all');
    console.log('5. Select your portal/org');
    console.log('6. Click "Create" and copy the code\n');
    process.exit(1);
}

console.log('\n🔄 Exchanging authorization code for tokens...\n');

const postData = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: AUTH_CODE,
}).toString();

const options = {
    hostname: 'accounts.zoho.com',
    port: 443,
    path: '/oauth/v2/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
    },
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);

            if (response.error) {
                console.log('❌ ERROR:', response.error);
                if (response.error === 'invalid_code') {
                    console.log('\nThe authorization code has expired or already been used.');
                    console.log('Please generate a new code from Zoho API Console.\n');
                }
                process.exit(1);
            }

            console.log('✅ SUCCESS! Here are your tokens:\n');
            console.log('='.repeat(60));
            console.log('\nACCESS TOKEN (expires in 1 hour):');
            console.log(response.access_token);
            console.log('\nREFRESH TOKEN (save this - it does not expire):');
            console.log(response.refresh_token);
            console.log('\n' + '='.repeat(60));
            console.log('\n📋 Add this to your backend/.env.local file:\n');
            console.log(`ZOHO_REFRESH_TOKEN=${response.refresh_token}`);
            console.log('\n✅ Done! You can now use the Zoho integration.\n');

        } catch (e) {
            console.log('❌ Failed to parse response:', data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Request failed:', e.message);
    process.exit(1);
});

req.write(postData);
req.end();
