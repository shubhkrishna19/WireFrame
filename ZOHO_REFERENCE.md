# Zoho Integration Reference Guide
> Complete reference for Bluewud e-commerce Zoho integration. Use this file to continue development in new chat sessions.

---

## Quick Reference

| Service | Base URL (US) | Purpose |
|---------|---------------|---------|
| OAuth | `https://accounts.zoho.com` | Token management |
| CRM | `https://www.zohoapis.com/crm/v2` | Contacts, Deals |
| Books | `https://www.zohoapis.com/books/v3` | Invoices, Inventory |
| Desk | `https://desk.zoho.com/api/v1` | Support tickets |
| Catalyst | `https://websitewireframeproject-895469053.development.catalystserverless.com` | Hosted functions |

---

## Authentication Credentials

```env
# Self Client (US Datacenter)
ZOHO_CLIENT_ID=1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA
ZOHO_CLIENT_SECRET=f60455449d30984ca1c026a872a2395cb5100dba36
ZOHO_REFRESH_TOKEN=1000.cc408dcaed84a05720ddb12f6a816e9c726b3e

# Endpoints
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_CRM_URL=https://www.zohoapis.com/crm/v2
ZOHO_BOOKS_URL=https://www.zohoapis.com/books/v3
ZOHO_DESK_URL=https://desk.zoho.com/api/v1
```

---

## Catalyst Deployed Function

**URL**: `https://websitewireframeproject-895469053.development.catalystserverless.com/server/bluewud_api/execute`

**Endpoints**:
- `GET /` or `/health` - Health check
- `GET /test-token` - Test OAuth token refresh
- `POST /order` - Create CRM contact + deal

**Files**:
- `functions/bluewud_api/index.js` - Main handler
- `functions/bluewud_api/config.js` - Credentials
- `backend/src/services/zohoClient.ts` - Full TypeScript client

---

## API Quick Reference

### 1. Refresh Access Token
```javascript
const response = await axios.post(
  'https://accounts.zoho.com/oauth/v2/token',
  null,
  {
    params: {
      refresh_token: ZOHO_REFRESH_TOKEN,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    },
  }
);
const accessToken = response.data.access_token;
```

### 2. Create CRM Contact
```javascript
await axios.post(
  'https://www.zohoapis.com/crm/v2/Contacts/upsert',
  {
    data: [{
      First_Name: 'John',
      Last_Name: 'Doe',
      Email: 'john@example.com',
      Phone: '9999999999',
      Lead_Source: 'Website',
    }],
    duplicate_check_fields: ['Email'],
  },
  { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
);
```

### 3. Create CRM Deal
```javascript
await axios.post(
  'https://www.zohoapis.com/crm/v2/Deals',
  {
    data: [{
      Deal_Name: 'Order #12345',
      Amount: 15000,
      Stage: 'New Order',
      Closing_Date: '2024-12-08',
      Contact_Name: contactId,
    }],
  },
  { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
);
```

### 4. Create Books Invoice
```javascript
await axios.post(
  'https://www.zohoapis.com/books/v3/invoices',
  {
    customer_id: booksCustomerId,
    reference_number: 'ORD-12345',
    line_items: [
      { name: 'Product Name', rate: 5000, quantity: 2 }
    ],
  },
  {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    params: { organization_id: ZOHO_ORG_ID },
  }
);
```

### 5. Create Desk Ticket
```javascript
await axios.post(
  'https://desk.zoho.com/api/v1/tickets',
  {
    subject: 'Order Issue',
    description: 'Customer complaint',
    email: 'customer@example.com',
    priority: 'High',
    channel: 'Web',
  },
  {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId: ZOHO_ORG_ID,
    },
  }
);
```

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/src/services/zohoClient.ts` | Full TypeScript Zoho client |
| `backend/src/routes/zohoWebhooks.ts` | Webhook handlers |
| `backend/.env.zoho.example` | Environment template |
| `functions/bluewud_api/index.js` | Catalyst function |
| `functions/bluewud_api/config.js` | Catalyst credentials |
| `backend/scripts/zoho-get-token.js` | OAuth token helper |

---

## Zoho Console URLs

- **API Console**: https://api-console.zoho.com
- **CRM**: https://crm.zoho.com
- **Books**: https://books.zoho.com
- **Desk**: https://desk.zoho.com
- **Catalyst Console**: https://console.catalyst.zoho.com
- **Flow (Automation)**: https://flow.zoho.com

---

## Common Scopes

```
ZohoCRM.modules.ALL
ZohoCRM.modules.Contacts.ALL
ZohoCRM.modules.Deals.ALL
ZohoCRM.users.READ
ZohoBooks.fullaccess.all
ZohoDesk.tickets.ALL
```

---

## Data Flow

```
Website Order → Catalyst Function → Zoho CRM (Contact + Deal)
                                  → Zoho Books (Invoice)
                                  → Zoho Desk (if support needed)
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid_client` | Wrong credentials | Verify Client ID/Secret |
| `invalid_code` | Auth code expired | Generate new code (expires in 2 min) |
| `AUTHENTICATION_FAILURE` | Token expired | Re-run token exchange script |
| Wrong datacenter | Account on different DC | US: `.com`, India: `.in`, EU: `.eu` |

---

## Next Steps for Future Development

1. **Add Books integration** - Create invoices on order
2. **Add Desk integration** - Auto-create tickets for issues
3. **Set up Zoho Flow** - Automate CRM → Books sync
4. **Create CRM sandbox** - Test without affecting production
5. **Add webhook listeners** - React to CRM/Books events
