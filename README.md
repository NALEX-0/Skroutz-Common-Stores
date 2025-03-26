# Skroutz Common Stores Extension

This Chrome extension helps you find **common stores** across two or more products on [skroutz.gr](https://www.skroutz.gr). It highlights stores that appear in all selected product listings, making price comparisons faster and easier.



## Features
- Add products using a floating button injected into the product page.
- View all added products in a popup UI.
- Highlight stores that are common across all selected products.


## Installation Instructions

1. **Clone or download the project:**

   ```bash
   git clone https://github.com/your-username/skroutz-common-stores-extension.git
   ```

2. **Open Chrome and go to:**

   ```
   chrome://extensions/
   ```

3. **Enable "Developer mode"** (top right corner).

4. **Click "Load unpacked"** and select the project folder you just cloned.

5. **Visit a product page on** [skroutz.gr](https://www.skroutz.gr)  
   and click the `+` button that appears to add products.

6. **Click the extension icon** in your Chrome toolbar to view your saved products and find common stores.



## Technologies Used

- **JavaScript**: Core logic for data extraction, UI rendering, and Chrome messaging.
- **HTML/CSS**: Popup UI layout and styling.
- **Chrome Extensions API**:
  - `storage.sync`: Save products across browser sessions.
  - `tabs` & `runtime messaging`: Communicate between popup and content scripts.

