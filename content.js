/********************************************************
 * Description
 * 
 */

(() => {
  /**
   * Find product title and product store IDs to send them in popup using chrome storage
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

      console.log(productCode);
      console.log(productTitle);
      
      chrome.storage.sync.set({ [productCode]: [productTitle, storeIDs] });
      /** 
       * Example:
       * [31106588]: ["Apple iPhone 13", ['shop-9838', 'shop-23381', ...]]
       */
    }
  }

  /**
   * Adds the Add button to skroutz page
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
      
      // addBtn.addEventListener("mouseover", () => {
      //   addBtn.style.backgroundColor = "#ececec"; 
      // });
      // addBtn.addEventListener("mouseout", () => {
      //   addBtn.style.backgroundColor = "transparent"; 
      // });
      // addBtn.addEventListener("mousedown", () => {
      //   addBtn.style.backgroundColor = "#d3d3d3"; 
      // });
      // addBtn.addEventListener("mouseup", () => {
      //   addBtn.style.backgroundColor = "transparent"; 
      // });

      addBtn.addEventListener("click", getLiElementIdsListener);
    }
  };

  /**
   * Locates common stores and marks them with light-blue background color
   * @param {*} storeID ToDo:
   * @param {*} titles 
   */
  const locateStore = (storeID, titles) => {
    var productName = document.getElementsByClassName("page-title")[0];
    productName = productName.innerText;
    var codeRegex = /Κωδικός: (.+)$/;
    var productTitle = productName.replace(codeRegex, '').trim();
    
    if (titles.some(name => name.includes(productTitle))) { // Check if we are in a product page, of the products we check for similar stores
      const olElement = document.getElementById('prices');
      if (olElement) {
        const liElement = olElement.querySelectorAll('li');
        liElement.forEach(li => {
          // if (li.id === store_id) {
          if (storeID.includes(li.id)) {
            li.style.backgroundColor = "#aad3f4";
          }
        });
      }
    }

  };
  
  addButtonToUserActions();

  // Locate common stores in the current page
  chrome.runtime.onMessage.addListener((object, sender, response) => {
    const { type, stores, titles } = object;
    if (type === "store") {
      locateStore(stores, titles);
    }
  });
  
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   console.log("ok1");
  //     if (request.type === 'store') {
  //       console.log("ok2");
  //       locateStore(request.value);
  //       console.log("ok3");
  //       // const productInfo = addButtonToUserActions();
  //       // sendResponse({ productInfo });
  //     }
  // });


})();
