/********************************************************
 * content.js
 * 
 * Content script injected into product pages on skroutz.gr
 * 
 * Responsibilities:
 * - Extracts product title, product code, and store IDs from the current page.
 * - Saves product information to Chrome's sync storage.
 * - Adds an add button to allow users to add a product to the extension.
 * - Listens for messages from the popup to highlight common stores on the page.
 * 
 * Interacts with:
 * - popup.js (for messaging)
 * - chrome.storage.sync (for data persistence)
 * 
 * Notes:
 * - Behavior is scoped only to pages matching: https://www.skroutz.gr/s/*
 ********************************************************/

(() => {
  /**
   * Collect product title and product store IDs to send them in popup using chrome synced storage.
   */
  function getLiElementIdsListener() {
    const storesList = document.getElementsByClassName("js-product-card");
    var productName = document.getElementsByClassName("page-title")[0];
    productName = productName.innerText;
    
    if (storesList && productName) {
      const storeIDs = Array.from(storesList).map(li => li.id);
      
      var codeRegularExpression = /Κωδικός Skroutz:\s*(\d+)$/;
      var match = productName.match(codeRegularExpression);
      var productCode = match ? match[1] : null;
      var productTitle = productName.replace(codeRegularExpression, '').trim();
      
      chrome.storage.sync.set({ [productCode]: [productTitle, storeIDs] });
      /** 
       * Example:
       * [31106588]: ["Apple iPhone 13", ['shop-9838', 'shop-23381', ...]]
       */
    }
  }

  /**
   * Injects the add button to skroutz.gr page.
   */
  const addButtonToUserActions = async () => {
    const myAddBtn = document.getElementsByClassName("my-add-btn")[0];

    if (!myAddBtn) {
      const addBtn = document.createElement("button");
      addBtn.style.width = "50px";
      addBtn.style.height = "50px";
      addBtn.style.padding = "0";
      addBtn.style.margin = "0";
      addBtn.style.position = "fixed";
      addBtn.style.bottom = "20px";
      addBtn.style.left = "20px";
      addBtn.style.zIndex = "10000";
      addBtn.style.borderRadius = "50%";
      addBtn.style.backgroundColor = "#f28c28";
      addBtn.style.color = "white";
      addBtn.style.fontSize = "30px";
      addBtn.style.fontWeight = "bold";
      addBtn.style.border = "none";
      addBtn.style.cursor = "pointer";
      addBtn.style.display = "flex";
      addBtn.style.alignItems = "center";
      addBtn.style.justifyContent = "center";
      addBtn.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
      addBtn.style.transition = "background-color 0.3s ease, transform 0.2s ease";
      addBtn.textContent = "+"; 
      addBtn.type = "button";
      addBtn.title = "Προσθήκη στην λίστα";

      document.body.appendChild(addBtn);
      
      addBtn.addEventListener("mouseover", () => {
        addBtn.style.backgroundColor = "rgb(255 158 63)"; 
      });
      addBtn.addEventListener("mouseout", () => {
        addBtn.style.backgroundColor = "#f28c28"; 
      });
      addBtn.addEventListener("mousedown", () => {
        addBtn.style.backgroundColor = "#d3d3d3"; 
      });
      addBtn.addEventListener("mouseup", () => {
        addBtn.style.backgroundColor = "#f28c28"; 
      });

      addBtn.addEventListener("click", getLiElementIdsListener);
    }
  };

  /**
   * Highlights common store elements and marks them with light-blue background color.
   * 
   * @param {string[]} storeIDs - Array of store element IDs that are common across all products.
   * @param {string[]} titles - Array of product titles.
   */
  const locateStore = (storeIDs, titles) => {
    storeCounter = 0;
    var productNameElement = document.getElementsByClassName("page-title")[0];

    var productName = productNameElement.innerText;
    var codeRegularExpression = /Κωδικός Skroutz:\s*(\d+)$/;
    var productTitle = productName.replace(codeRegularExpression, '').trim();
    
    if (titles.some(name => name.includes(productTitle))) { 
      const olElement = document.getElementById('prices');
      if (olElement) {
        const liElements = olElement.querySelectorAll('li');
        liElements.forEach(li => {
          if (storeIDs.includes(li.id)) {
            li.style.backgroundColor = "#aad3f4";
            storeCounter += 1;
          }
        });
      }
    }
  };
  
  addButtonToUserActions();

  /**
   * Listens for messages sent from the popup.
   * When a "store" message is received, it calls locateStore()
   * 
   */
  chrome.runtime.onMessage.addListener((object, sender, response) => {
    const { type, stores, titles } = object;
    if (type === "store") {
      locateStore(stores, titles);
    }

  });

})();
