import {list_article} from "./static/list_article.js";

let article_in_basket =[]

const article_display_container = document.getElementById("article_display_container");

list_article.forEach(function(article) {
    article_display_container.innerHTML += `
      <div class="article_container brown_box">
        <img src="${article.img}" class="image_article">
        <div class="article_description">
          <div class="name_article">
            <h2>${article.nom_article}</h2>
          </div>
          <div class="article_price">
            <h3>Prix : ${article.prix_article}$</h3>
          </div>
          <button class="bt_add_cart" id="${article.nom_article}">Add to cart</button>
        </div>
      </div>
    `;
;
});


const add_to_cart = Array.from(document.getElementsByClassName("bt_add_cart"))
add_to_cart.forEach(function(bt){
    bt.addEventListener("click", function(){
      const saveid = this.id
      const bon_article = list_article.find(function(article){
        return article.nom_article === saveid
      })

      if (article_in_basket.find(function(item){
        return item.nom_article === bon_article.nom_article;

      })){
        bon_article.quantity ++
      }
      else {
        article_in_basket.push(bon_article)
        bon_article.quantity = 1
      }
      display_list_article()

    })
})

const list_article_panier_HTML = document.getElementById("list_article_panier_HTML");

function display_list_article(){
  if (article_in_basket.length > 0){
    list_article_panier_HTML.innerHTML = "<div>Your shopping cart : </div>"
    article_in_basket.forEach(function(article){
      list_article_panier_HTML.innerHTML += `
        <div class="article_description_panier brown_box">
          <div>
            <div class="name_article">
              <h5>${article.nom_article}</h5>
            </div>
            <div>
              <h5 class="article_price">Price : ${article.prix_article}$<br>
              Quantity : ${article.quantity}</h5>
            </div>
            <button class="bt_change_quantity bt_add_cart" id="${article.nom_article}">Change Quantity</button>
          </div>
          <div>
            <button class="bt_cancel_cart" id="${article.nom_article}">X</button>
          </div>
        </div>
`
    })
    list_article_panier_HTML.innerHTML += `
      <button class="bt_validate_cart" id="bt_validate_cart">Valider le panier</button>`
  }
  else {
    list_article_panier_HTML.innerHTML = "<div>Il n'y a pas d'article dans le panier</div>"
  }
  validate_cart()
  cancel_article()
  change_quantity()
}

const change_quantity_bt= document.getElementById("change_quantity_bt")
const container_quantity= document.getElementById("container_quantity")
let selected_article = null

function change_quantity() {
  const change_quantity = Array.from(document.getElementsByClassName("bt_change_quantity"))
  change_quantity.forEach(function(bt){
    bt.addEventListener("click", function(){
      const saveid = this.id
      const bon_article = list_article.find(function(article){
        return article.nom_article === saveid
      })
      container_quantity.classList.toggle("container_quantity_ON");
      selected_article = bon_article
      display_list_article()
    })
  })
}

change_quantity_bt.addEventListener('click',function(){
  let quantity_nb = document.getElementById("quantity_nb")
  selected_article.quantity = parseInt(quantity_nb.value)
  display_list_article()
  container_quantity.classList.toggle("container_quantity_ON");
  
})

function cancel_article() {
  const remove_to_cart = Array.from(document.getElementsByClassName("bt_cancel_cart"));
  remove_to_cart.forEach(function (bt) {
    bt.addEventListener("click", function () {
      const saveid = this.id;
      const bon_article = article_in_basket.find(function (item) {
        return item.nom_article === saveid;
      });

      article_in_basket = article_in_basket.filter(function (item) {
        return item.nom_article !== saveid;
      });

      display_list_article();
    });
  });
}


function validate_cart(){
  const bt_validate_cart = document.getElementById("bt_validate_cart");
  if (bt_validate_cart) {
    bt_validate_cart.addEventListener("click", function(){
      const jsonData = JSON.stringify(article_in_basket);

      fetch('/panier-checkout', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: jsonData
      })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              console.error('Error:', data.error);
          } else {
              console.log('Checkout session created:', data.url);
              window.location.href = data.url;  // Redirect to the checkout session URL
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
    });
  }
}

const bt_cancel_quantity = document.getElementById("bt_cancel_quantity")
bt_cancel_quantity.addEventListener('click',function(){
  container_quantity.classList.toggle("container_quantity_ON");
})