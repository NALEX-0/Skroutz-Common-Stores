// popup.js

const onDelete = async e => {
  var product_code = e.target.parentNode.parentNode.id;
  console.log("onDelte " + product_code);
  chrome.storage.sync.remove(product_code);
  // chrome.storage.sync.clear();
  chrome.storage.sync.get(null, function(items) {
    viewProducts(items);
  });
}

const addNewProduct = (productsElement, product, product_code) => {
  // const productTitleElement = document.createElement("td"); 
  // const controlsElement = document.createElement("td");
  // const newProductElement = document.createElement("tr");
  const productTitleElement = document.createElement("div"); 
  const controlsElement = document.createElement("div");
  const newProductElement = document.createElement("div");

  const product_title = product[0];

  const productElement = document.createElement("div");
  const detailsElement = document.createElement("div");
  const nameElement = document.createElement("p");

  nameElement.innerText = product_title;
  nameElement.className = "product-name";
  detailsElement.appendChild(nameElement);
  deleteElement.className = "product-details";


  productTitleElement.textContent = product_title; 
  productTitleElement.className = "product-title"; 
  controlsElement.className = "product-controls";

  // const deleteElement = document.createElement("img");
  // deleteElement.src = "assets/delete.png";
  // deleteElement.title = "delete";
  // deleteElement.addEventListener("click", onDelete);
  const deleteElement = document.createElement("button");
  deleteElement.className = "delete-button";
  deleteElement.innerHTML = "&#128465;";
  controlsElement.appendChild(deleteElement);

  newProductElement.id = product_code; 
  newProductElement.className = "product";

  // newProductElement.appendChild(productTitleElement);
  // newProductElement.appendChild(controlsElement);
  productsElement.appendChild(newProductElement);
  productElement.id = product_code;
  productElement.className = "product";
  
  productElement.appendChild(detailsElement);
  productsElement.appendChild(ProductElement);
};


const findCommonStores = (decisionElement, products_ids, products_titles) => {
  const first_product = products_ids[0];
  var common_stores = [];
  var counter = 0;
  for (let i = 0; i < first_product.length; i++) {
    const candidate = first_product[i];

    if (products_ids.every(array => array.includes(candidate))) {
      common_stores.push(candidate);
      counter++;
    }
  }
  if (counter == 0) {
    decisionElement.innerHTML = "Δεν υπάρχουν κοινά καταστήματα";
    return;
  }
  decisionElement.innerHTML = "Υπάρχουν κοινά καταστήματα";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "store", stores: common_stores, titles: products_titles });
  });

};

const viewProducts = (currentProducts) => { 
  // const productsElement = document.getElementById("products");
  const productsElement = document.getElementById("products-container");
  productsElement.innerHTML = "";
  const decisionElement = document.getElementById("decision");

  const products_code = Object.keys(currentProducts);
  const products_titles = new Array(products_code.length);

  if (products_code.length > 0) { 
    for (let i=0; i<products_code.length; i++) { 
      const product = currentProducts[products_code[i]]; 
      addNewProduct(productsElement, product, products_code[i]);
    }
    if (products_code.length > 1) { 
      var products_ids = new Array(products_code.length);
      for (let i=0; i<products_code.length; i++) {
        products_ids[i] = currentProducts[products_code[i]][1];
        products_titles[i] = currentProducts[products_code[i]][0];
      }
      findCommonStores(decisionElement, products_ids, products_titles);
    }
  } else {
    productsElement.innerHTML = '<i class="row">Δεν έχουν προστεθεί προϊόντα</i>';
  }

  return;
};


document.addEventListener("DOMContentLoaded", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTabUrl = tabs[0].url;
    if (currentTabUrl.includes("skroutz.gr")) {
      // chrome.storage.sync.clear();
      chrome.storage.sync.get(null, function(items) { // TAKE ALL, put the titles in array and ids in 2d array, send them to viewBookmarks()
        
        // console.log(products); // code
        // console.log(items[products][0]); // title  not for more than 1 products
        // console.log(items[products][1]); // ids  not for more than 1 products

        // viewProducts(products);
        viewProducts(items);
      });
     
    } else {
      const container = document.getElementsByClassName("container")[0];
      
      // container.innerHTML = '<div class="title">This tab is not skroutz.</div>';
      container.innerHTML = '<div class="title">Το extension δουλεύει μόνο στο skroutz.gr</div>';
    }
  });
});

  