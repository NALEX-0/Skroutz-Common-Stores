/********************************************************
 * popup.js
 * 
 * Script for the popup UI of the Chrome extension.
 * 
 * Responsibilities:
 * - Retrieves and displays stored products in the popup.
 * - Allows users to delete products from storage.
 * - Finds common stores across all selected products.
 * - Communicates with the content script to highlight stores on skroutz.gr.
 * 
 * Dependencies:
 * - popup.html (structure)
 * - popup.css (styling)
 * - chrome.storage.sync (data persistence)
 * - chrome.tabs / messaging (content script interaction)
 * 
 * Notes:
 * - This script only runs when the popup is opened and the active tab is on skroutz.gr.
********************************************************/

/**
 * Handles deletion of a product.
 * Called when clicks the delete button.
 * 
 * @param {Event} e The click event triggered by the button.
 */
const onDelete = async e => {
  var productCode = e.target.id;
  console.log("onDelete " + productCode);
  chrome.storage.sync.remove(productCode);
  // chrome.storage.sync.clear(); // Delete all products
  chrome.storage.sync.get(function(products) {
    showProducts(products);
  });
}

/**
 * Adds a new product element to the popup.
 * 
 * @param {HTMLElement} productsElement The parent container where the product will be added.
 * @param {[string, string[]]} productObject A tuple containing the products.
 * @param {string} productCode The product code
 */
const addNewProduct = (productsElement, productObject, productCode) => {
  const productTitle = productObject[0];
  
  const productElement = document.createElement("div");
  const detailsElement = document.createElement("div");
  
  const nameElement = document.createElement("p");
  nameElement.innerText = productTitle;
  nameElement.className = "product-name";

  productElement.className = "product";

  detailsElement.className = "product-details";
  detailsElement.id = productCode;
  detailsElement.appendChild(nameElement);
  productElement.appendChild(detailsElement);
  
  const deleteElement = document.createElement("button");
  deleteElement.className = "delete-button";
  deleteElement.innerHTML = "&#128465;";
  deleteElement.id = productCode;
  deleteElement.addEventListener("click", onDelete);
  productElement.appendChild(deleteElement);
  
  productsElement.appendChild(productElement);
};

/**
 * Finds common store IDs across all selected products.
 * 
 * @param {HTMLElement} decisionElement The element used to display the result message.
 * @param {string[][]} productIDs A 2D array where each element containing store IDs for the product.
 * @param {string[]} productTitles An array of product titles
 */
const findCommonStores = (decisionElement, productIDs, productTitles) => {
  const firstProduct = productIDs[0];
  var commonStores = [];
  var counter = 0;
  for (let i=0; i<firstProduct.length; i++) {
    const candidate = firstProduct[i];

    if (productIDs.every(array => array.includes(candidate))) {
      commonStores.push(candidate);
      counter++;
    }
  }
  if (counter == 0) {
    decisionElement.innerText = "Δεν υπάρχουν κοινά καταστήματα";
    return;
  }
  decisionElement.innerText = "Υπάρχουν " + counter + " κοινά καταστήματα";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "store", stores: commonStores, titles: productTitles });
  });

};

/**
 * Displays all products in the popup and checks for common stores.
 * 
 * @param {{[productCode: string]: [string, string[]]}} currentProducts
 *    An object where each key is a product code and each value is a tuple: [productTitle, storeIDs].  
 */
const showProducts = (currentProducts) => { 
  const productsElement = document.getElementById("products-rows");
  const decisionElement = document.getElementById("decision");
  const titleElement = document.getElementById("my-products-title");

  titleElement.innerText = "Τα προϊόντα μου";

  // Clear previous products to prevent duplication
  productsElement.innerHTML = '';

  const productCodes = Object.keys(currentProducts);
  
  if (productCodes.length > 0) { 
    for (let i=0; i<productCodes.length; i++) { 
      const productObject = currentProducts[productCodes[i]]; 
      addNewProduct(productsElement, productObject, productCodes[i]);
      decisionElement.innerText = '';
    }
    if (productCodes.length > 1) { 
      var productTitles = new Array(productCodes.length);
      var productStoreIDs = new Array(productCodes.length);
      for (let i=0; i<productCodes.length; i++) {
        productTitles[i] = currentProducts[productCodes[i]][0];
        productStoreIDs[i] = currentProducts[productCodes[i]][1];
      }
      findCommonStores(decisionElement, productStoreIDs, productTitles);
    }
  } else {
    productsElement.innerText = 'Δεν έχουν προστεθεί προϊόντα';
    decisionElement.innerText = '';
  }

  return;
};

/**
 * Initializes the popup when the DOM content has fully loaded.
 * 
 */
document.addEventListener("DOMContentLoaded", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTabUrl = tabs[0].url;
    if (currentTabUrl.includes("skroutz.gr")) {
      
      // chrome.storage.sync.clear();
      // chrome.storage.sync.clear(function() {
      //   console.log('Local storage cleared.');
      // });

      chrome.storage.sync.get(function(products) { 
        
        // [productCode: string]: [productTitle: string, storeIDs: string[]]
        // products[product_code][0] -> title of product with code = product_code
        // products[product_code][1] -> store ids of product with code = product_code

        // products = {
        //   "31106588": ["Apple iPhone 13", ["shop-123", "shop-456"]],
        //   ...
        // }

        showProducts(products);
      });
     
    } else {
      const container = document.getElementById("decision");
      container.innerText = 'Το extension δουλεύει μόνο στο skroutz.gr';
    }
  });
});

  