// content.js

(() => {
  function getLiElementIds() {
    const pricesList = document.getElementsByClassName("js-product-card");
    var product_name = document.getElementsByClassName("page-title")[0];
    product_name = product_name.innerText;
    
    if (pricesList && product_name) {
      const ids = Array.from(pricesList).map(li => li.id);

      var codeRegex = /Κωδικός: (.+)$/;
      var match = product_name.match(codeRegex);
      var product_code = match ? match[1] : null;
      var product_title = product_name.replace(codeRegex, '').trim();

      chrome.storage.sync.set({ [product_code]: [product_title, ids] });
    }
  }


  const addButtonToUserActions = async () => {
    const myAddBtn = document.getElementsByClassName("my-add-btn")[0];

    if (!myAddBtn) {
      const addBtn = document.createElement("button");
      const img = document.createElement("img");

      img.src = chrome.runtime.getURL("assets/add2.png");
      img.width = 30;
      addBtn.appendChild(img);
      addBtn.style.width = "50px";
      addBtn.style.height = "50px";
      addBtn.style.padding = "0";
      addBtn.style.margin = "0";
      // addBtn.style.display = "flex";

      addBtn.style.position = "fixed";
      addBtn.style.top = "640px";
      addBtn.style.left = "20px";
      addBtn.style.zIndex = "10000";

      // top: 520px; left: 5px;
      // position: fixed; z-index: 10000;

      // addBtn.style.alignItems = "center"; 
      // addBtn.style.justifyContent = "center";
      addBtn.style.borderRadius = "50%";
      addBtn.style.backgroundColor = "transparent";
      addBtn.type = "button";
      // addBtn.className = "rc-icon-btn icon " + "my-add-btn";
      addBtn.title = "Προσθήκη στην λίστα";

      // const skr = document.getElementsByName("body");
      // skr.appendChild(addBtn);

      document.body.appendChild(addBtn);
      
      // skrControls = document.getElementsByClassName("user-action-icons")[0];
      // skrControls.appendChild(addBtn);

      addBtn.addEventListener("mouseover", () => {
        addBtn.style.backgroundColor = "#ececec"; 
      });
      addBtn.addEventListener("mouseout", () => {
        addBtn.style.backgroundColor = "transparent"; 
      });
      addBtn.addEventListener("mousedown", () => {
        addBtn.style.backgroundColor = "#d3d3d3"; 
      });
      addBtn.addEventListener("mouseup", () => {
        addBtn.style.backgroundColor = "transparent"; 
      });

      addBtn.addEventListener("click", getLiElementIds);
    }
  };

  const locateStore = (store_id, titles) => {
    var product_name = document.getElementsByClassName("page-title")[0];
    product_name = product_name.innerText;
    var codeRegex = /Κωδικός: (.+)$/;
    var product_title = product_name.replace(codeRegex, '').trim();
    
    if (titles.some(name => name.includes(product_title))) {
      const olElement = document.getElementById('prices');
      if (olElement) {
        const liElement = olElement.querySelectorAll('li');
        liElement.forEach(li => {
          // if (li.id === store_id) {
          if (store_id.includes(li.id)) {
            li.style.backgroundColor = "#aad3f4";
          }
        });
      }
    }

  };
  
  // Call the function to add the button
  addButtonToUserActions();
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
