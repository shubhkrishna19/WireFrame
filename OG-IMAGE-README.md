# Creating Open Graph Image

Since we can't generate images directly, here's what you need for the OG image:

## Option 1: Create Manually
Create `public/og-image.jpg` with these specifications:
- **Dimensions**: 1200 x 630 pixels
- **Design**:
  - Bluewud logo in center (light blue #5DADE2)
  - Tagline "every home's a story" in Dancing Script
  - Background: Premium furniture imagery or elegant gradient
  - Text: "Premium Furniture for Modern Living"
  
## Option 2: Use Canva
1. Go to Canva.com
2. Search for "Open Graph" template (1200x630)
3. Add:
   - BLUEWUD text in Montserrat Bold (#5DADE2)
   - Subtitle: "every home's a story" in cursive
   - Background: Furniture image
   - Footer: "Premium Furniture • Modern Living"
4. Download as JPG to `/public/og-image.jpg`

## Already Configured
The SEO component (`src/components/SEO.tsx`) is already set up to use `/og-image.jpg` for:
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Social media sharing

Just add the image file to make it work!

## Quick Fix Placeholder
For now, you can use a placeholder:
```bash
# Download a furniture stock image and rename it to og-image.jpg
# Place in: public/og-image.jpg
```

The meta tags are already configured in SEO.tsx lines 68, 76!
