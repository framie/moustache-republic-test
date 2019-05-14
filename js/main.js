// Used as a pseudo database containing product information
let productInfo = {
    0: {
        "name": "Classic Tee",
        "price": "75.00",
        "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod " + 
        "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis " +
        "nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "image": "classic-tee.jpg",
        "sizes": {
            "S": 2,
            "M": 3,
            "L": 4
        }
    }
}

let currentCart = {}

let product = null;
let showMinicart = false;

function getProductInfo(id){
    if (!product) {
        if (id < 0 || id > productInfo.length - 1) {
            console.log("Product id does not exist, send user to 404 page");
            return;
        }
        product = productInfo[id];
    }
    
    document.getElementsByClassName("product-image")[0].src = "img/" + product.image;
    document.getElementsByClassName("product-name")[0].innerHTML = product.name;
    document.getElementsByClassName("product-price")[0].innerHTML = "$" + product.price; document.getElementsByClassName("product-description")[0].innerHTML = product.desc;
    updateSizes();
}

function updateSizes(){
    let sizesContainer = document.getElementsByClassName("sizes-container")[0];
    if (sizesContainer.innerHTML == "") {
        for (let size in product.sizes) {
            if (product.sizes[size] > 0) {
                sizesContainer.innerHTML += "<input class='size' type='button' value='" + size + "' onclick='selectSize(this)'>";
            } else {
                sizesContainer.innerHTML += "<input class='size disabled' type='button' value='" + size + "'>";
            }
        }
    } else {
        let sizeButtons = document.getElementsByClassName("size");
        for (let i = 0; i < sizeButtons.length; i++) {
            let button = sizeButtons[i];
            if (product.sizes[button.value] == 0 && !button.classList.contains("disabled")) {
                button.classList.add("disabled");
                if (button.classList.contains("selected")) {
                    button.classList.remove("selected");
                    document.getElementsByClassName("selected-size")[0].innerHTML = "";
                }
            } else if (product.sizes[button.value] > 0 && button.classList.contains("disabled")) {
                button.classList.remove("disabled");
            }
        }
    }
    if (document.getElementsByClassName("size disabled") == Object.keys(productInfo[0].sizes).length) {
        document.getElementsByClassName("cart-submit")[0].classList.add("disabled");
    }
}

function selectSize(ele){
    let sizeButtons = document.getElementsByClassName("size");
    for (let i = 0; i < sizeButtons.length; i++) {
        let button = sizeButtons[i];
        if (button.classList.contains("selected")) {
            button.classList.remove("selected");
            break;
        } 
    }
    ele.classList.add("selected");
    document.getElementsByClassName("selected-size")[0].innerHTML = " " + ele.value;
}

function addToCart(id){
    let sizeButtons = document.getElementsByClassName("size");
    let size = null;
    for (let i = 0; i < sizeButtons.length; i++) {
        let button = sizeButtons[i];
        if (button.classList.contains("selected")) {
            size = button.value;
        } 
    }
    if (size == null) {
        alert("A size must be selected before adding to cart.");
        return;
    }
    if (!(id in currentCart)) {
        currentCart[id] = {"sizes": {}};
    } 
    if (!(size in currentCart[id].sizes)) {
        currentCart[id].sizes[size] = 1;
    } else {
        currentCart[id].sizes[size] += 1;
    }
    productInfo[id].sizes[size] -= 1;
    updateSizes();
    updateMiniCart();
}

function updateMiniCart(){
    let totalItems = 0;
    let miniCart = document.getElementsByClassName("mini-cart")[0];
    if (miniCart.innerHTML == "" || miniCart.innerHTML == '<p class="placeholder">Your cart is currently empty.</p>') {
        if (Object.keys(currentCart).length == 0) {
            miniCart.innerHTML = "<p class='placeholder'>Your cart is currently empty.</p>";
        } else {
            miniCart.innerHTML = "";
            for (let id in currentCart) {
                for (let size in currentCart[id]["sizes"]) {
                    let quantity = currentCart[id]["sizes"][size];
                    let item = productInfo[id];
                    miniCart.innerHTML += "<div class='mini-cart-item'><div class='image-container'><img class'item-image' alt='Item image' src='img/" + item.image + "'></div><div class='info-container'><p class='item-name'>" + item.name + "</p><br><p class='item-quantity'>" + quantity + "x </p><h2 class='item-price'>$" + item.price + "</h2><p class='item-size' value='" + size + "'><br>Size: " + size + "</p>"
                    totalItems += quantity;
                }
            }
        }
    } else {
        for (let id in currentCart) {
            for (let size in currentCart[id]["sizes"]) {
                let quantity = currentCart[id]["sizes"][size];
                let items = document.getElementsByClassName("mini-cart-item");
                let found = false;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].getElementsByClassName("item-size")[0].innerHTML.split(' ')[1] == size) {
                        items[i].getElementsByClassName("item-quantity")[0].innerHTML = currentCart[id]["sizes"][size] + "x ";
                        found = true;
                    }
                }
                if (!found) {
                    let item = productInfo[id];
                    miniCart.innerHTML += "<div class='mini-cart-item'><div class='image-container'><img class'item-image' alt='Item image' src='img/" + item.image + "'></div><div class='info-container'><p class='item-name'>" + item.name + "</p><br><p class='item-quantity'>" + quantity + "x </p><h2 class='item-price'>$" + item.price + "</h2><p class='item-size' value='" + size + "'><br>Size: " + size + "</p>"
                }
                totalItems += quantity;
            }
        }
    }
    document.getElementsByClassName("mini-cart-button")[0].value = "My Cart ( " + totalItems + " )";
}

function miniCartToggle(){
    showMinicart = !showMinicart;
    if (showMinicart) {
        document.getElementsByClassName("mini-cart-button")[0].classList.add("visible");
        document.getElementsByClassName("mini-cart")[0].classList.add("visible");
    } else {
        document.getElementsByClassName("mini-cart-button")[0].classList.remove("visible");
        document.getElementsByClassName("mini-cart")[0].classList.remove("visible");
    }
}

getProductInfo(0);
updateMiniCart();