/********************************************************
 * Description
 * 
 */

const onDelete = async e => {
  var productCode = e.target.id;
  console.log("onDelete " + productCode);
  chrome.storage.sync.remove(productCode);
  // chrome.storage.sync.clear(); // Delete all products
  chrome.storage.sync.get(null, function(products) {
    showProducts(products);
  });
}

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
  decisionElement.innerText = "Υπάρχουν κοινά καταστήματα";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "store", stores: commonStores, titles: productTitles });
  });

};

// ToDo: Να γράψω τι τυπος είναι το κάθε ενα: items, productIDs
// δουλεύει για πάνω απο ένα προιοντα ?

const showProducts = (currentProducts) => { 
  const productsElement = document.getElementById("products-rows");
  const decisionElement = document.getElementById("decision");

  // Clear previous products to prevent duplication
  productsElement.innerHTML = '';

  const productCodes = Object.keys(currentProducts);
  
  if (productCodes.length > 0) { 
    for (let i=0; i<productCodes.length; i++) { 
      const productObject = currentProducts[productCodes[i]]; 
      addNewProduct(productsElement, productObject, productCodes[i]);
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
  }

  return;
};


document.addEventListener("DOMContentLoaded", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTabUrl = tabs[0].url;
    if (currentTabUrl.includes("skroutz.gr")) {
      // chrome.storage.sync.clear(); // !!!!!!

      // chrome.storage.sync.clear(function() {
      //   console.log('Local storage cleared.');
      // });

      // ToDo: What is null and why null
      chrome.storage.sync.get(null, function(products) { 
        
        // console.log(products[product_code][0]); // title of product with code = product_code
        // console.log(products[product_code][1]); // store ids of product with code = product_code
        // console.log(products["17372972"][0]); // Example

        showProducts(products);
      });
     
    } else {
      const container = document.getElementsByClassName("decision");
      
      // container.innerHTML = '<div class="title">This tab is not skroutz.</div>';
      // container.innerHTML = '<div class="title">Το extension δουλεύει μόνο στο skroutz.gr</div>';
      container.innerText = 'Το extension δουλεύει μόνο στο skroutz.gr';
    }
  });
});

  