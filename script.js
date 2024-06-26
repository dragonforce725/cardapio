const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closemodalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closemodalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //add to carrinho
        addToCart(name, price)
    }
})

function addToCart(name, price){
    const existItem = cart.find(item => item.name === name)

    if(existItem){
        existItem.quantity += 1;
    } else{
        cart.push({
            name,
            price,
            quantity: 1
        })
    }
    updateCartModal()
    
}

function updateCartModal(){

    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justfy-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class= "flex items-center justify-between">
            <div>
                <p class= "font-medium">${item.name}
                <p>${item.quantity}
                <p class= "font-medium mt-2">R$ ${item.price.toFixed(2)}
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>

        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;

    return total;


}

//remover item carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index!== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
        
    }
})


//Finalizar Pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();

    if (!isOpen) {
        Swal.fire({
            title: 'Restaurante Fechado',
            text: 'DESCULPE O TRANSTORNO, MAS O RESTAURANTE ESTÁ FECHADO NO MOMENTO!',
            confirmButtonText: 'OK'
        });
        return;        
    }

    if(cart.length === 0 ) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //obter o valor total do carrinho
    const total = updateCartModal();

    // enviar pedido para wpp
    const cartItens = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço R$ ${item.price.toFixed(2)} ||`
        )
    }).join("")

    const message = encodeURIComponent(cartItens)
    const phone = "+5521980243420"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} Total:R$ ${total.toFixed(2)}`, "_blank")

    cart = [];
    updateCartModal();
})


// Verificar a hora de funcionamento
function checkRestaurantOpen() {

    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <= 23;
    
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
} else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}