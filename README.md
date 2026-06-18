# 🚀 QuickFix Service Booking Platform (Part 3: Vanilla JavaScript)

## Student Information
**Nemamilwe Tshedza**  
**Student Number:** st10522537  
**School Project** -

## Project Overview
QuickFix is a static HTML website MVP for connecting South African users with local service providers (electricians, gardeners, mechanics, plumbers, phone repairs). Features service showcases, booking/contact forms, and images to solve unreliable tradespeople issues.

## Website Goals and Objectives (from Proposal)
- Launch MVP within 3 months
- Onboard 100 verified providers in Gauteng
- Acquire 1,000 users in 6 months
- 80% customer satisfaction
- R500k revenue Year 1 from fees

## Pages
- **index.html (Home)**
  - Tabs for quick actions
  - Image gallery with lightbox modal
  - SEO meta tags
- **services.html (Services)**
  - Live service search filtering (vanilla JS)
  - Service details in **accordions** inside **modals**
  - SEO meta tags
- **about.html (About Us)**
  - Mission + team information
  - SEO meta tags + internal links
- **contact.html (Contact Form)**
  - Client-side validation (name, phone, email, required fields)
  - AJAX submission simulation
  - Success composes a **mailto:** message using the entered data
- **booking.html (Booking)**
  - Accordion steps for booking flow
  - Confirmation modal on submit
- **enquiry.html (Enquiry Form - required)**
  - Client-side validation (name, phone, email, required fields)
  - After validation, shows availability + estimated cost (client-side demo)

## Part 3 Requirements Implemented (Vanilla JavaScript)

### 1) Interactive elements
Implemented in **js/quickfix.js**:
- Modals (`data-modal`, `data-open-modal`, `[data-close-modal]`)
- Tabs (`data-tabs`, `data-tab-button`, `data-tab-panel`)
- Accordions (`data-accordion`, `data-accordion-item`, `data-accordion-toggle`)
- Lightbox image preview (`#quickfix-lightbox`, `data-lightbox-gallery`)
- Smooth UI transitions + accessibility support (Escape closes modals/lightbox)

### 2) Image gallery with lightbox effect
- **index.html** and **services.html** include thumbnails with:
  - `data-lightbox-gallery`
  - `data-lightbox-thumb`
  - `data-lightbox-src`
  - `data-lightbox-caption`
- Lightbox content uses the shared modal host in each page.

### 3) Search feature that filters services dynamically
- **services.html** uses:
  - `[data-service-search]` input
  - `[data-service-item]` elements with `data-service="..."`
  - Live updates of visible services as the user types

### 4) DOM manipulation
- All interactivity is implemented with vanilla DOM queries, event listeners, and attribute/state changes.

### 5) Enquiry form (enquiry.html)
- Validates:
  - Full name (letters/spaces)
  - Phone number (South Africa format)
  - Email address
  - Required fields
- After successful validation, displays:
  - Service availability (High/Medium)
  - Estimated cost (deterministic client-side calculation)

### 6) Contact form (contact.html)
- Validates:
  - Name, phone, email
  - Required message field
- Uses AJAX-style submission simulation (setTimeout delay)
- On success:
  - Builds a `mailto:` link with subject + message body
  - Redirects the browser to the `mailto:` link

### 7) Clear error messages + instant feedback
- Inline error spans:
  - `.field-error[data-error-for="..."]`
- Invalid inputs get `aria-invalid="true"`.

### 8) AJAX form submission where appropriate
- Implemented as a client-side simulated AJAX delay on **contact.html**.

### 9) SEO best practices (every page)
Each page includes:
- Unique `<title>`
- `<meta name="description">`
- `<meta name="keywords">`
- Proper headings (`h1` for page title, `h2/h3` for sections)
- Image `alt` text for accessibility

### 10) robots.txt and sitemap.xml
- `robots.txt`
- `sitemap.xml`

### 11) Performance + loading speed
- JavaScript loaded with `defer` to avoid blocking rendering.

### 12) Responsiveness
- Layout is responsive using existing `styles.css` + added component styles.

### 13) Organized JS code
- All Part 3 JS is centralized in:
  - `js/quickfix.js`
- Includes comments and modular init functions.

## Project Structure (File Placement)
```
QuickFix2/
  index.html
  services.html
  about.html
  contact.html
  booking.html
  enquiry.html
  styles.css
  robots.txt
  sitemap.xml
  js/
    quickfix.js
  images/
    Electricians.jpg
    Gardeners.jpg
    Mechanics.jpg
    Extras.jpg
```

## How to Run
Open `index.html` in a browser. No external dependencies.

## Changelog
- **v1.0**: Core HTML pages
- **v1.1**: Images + initial README
- **v1.2 (Current - Part 3)**:
  - Implemented vanilla JS interactivity (modals/tabs/accordions/lightbox)
  - Implemented live service filtering
  - Added enquiry + contact client-side validation + form logic
  - Added robots/sitemap
  - Added SEO meta tags to all pages

