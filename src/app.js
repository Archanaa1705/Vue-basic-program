let app = Vue.createApp({
    data() {
      return {

        showSideBar:false,
        inventory: [],
        cart: {
         
        },
        search: '',
        filter:''
      }
    },
    computed:{

        totalQuantity(){
          return Object.values(this.cart).reduce((initialValue,currentValue)=>{
              console.log("initialValue in total cart items", initialValue) 

                    console.log("currentValue in total cart items", currentValue)

            return initialValue+currentValue
          },0) //archanaa intial value is set here as Zero
        },

        SearchProduct:function(){

            return this.inventory.filter((product)=> { 
              console.log("search value ", this.search)
              // console.log("match value ", product.name===this.search)
              // return product.name===this.search
              console.log("match value ",  product.name.match(this.search))
              return product.name.match(this.search)
            })
            // return product.name
         
         
         },
         
         filterProduct:function(){

          return this.inventory.filter((product)=> { 
            console.log("inventory value ", this.inventory)
            console.log("filter value ", this.filter)
            // console.log("match value ", product.name===this.filter)
            // return product.name===this.filter
            console.log("match value ",  product.type.match(this.filter))
            return product.type.match(this.filter)
          })
          // return product.name
       
       
       }
    },
    methods: {

              toggleSideBar(){
               this.showSideBar=!this.showSideBar

              },
              addToCart(name,index){
                if(!this.cart[name]) //archanaa if no items are added it displays 0 else it throws Nan exception
                this.cart[name]=0

                this.cart[name]+=this.inventory[index].quantity //archanaa looping through the inventory through their index
                console.log("cart",this.cart)
                this.inventory[index].quantity =0
                console.log("inventory",this.inventory)
                

              },

              removeItem(name){
                delete this.cart[name] 

              }
      },
     async mounted(){ //archanaa lifecycle hooks and components to refer JSON files

        const res=await fetch('./food.json')
        const data=await res.json()
        this.inventory=data
      }
  })
  app.component('sidebar',{
    props:['toggle','cart','inventory','remove'], //archanaa receive as an prop from various components
    computed:{

      
    },

    methods:{
      getPrice(name){
     const findProductByPrice = this.inventory.find((product)=> { // find will loop through all the values in inventory using product as loop values
                      return product.name===name

                  })
                    return findProductByPrice.price.USD
                },



                calculateTotal(){
                 
                  //archanaa object.entries works as [key, value] 
                  //reduce is built in JS function 
                  //sum calculates the sum through every iteration
                  //current loops through the current item in the array
                  const total=Object.entries(this.cart).reduce((initialValue,currentValue,index)=>{

                    console.log("cart list", Object.entries(this.cart))

                    console.log("initialValue", initialValue) //initil value is set to zero

                    console.log("currentValue[1]", currentValue[1])// current value is quantity entered .array displays as[ carrot, quantity entered]

                    console.log("currentValue[0] price", this.getPrice(currentValue[0]))

                  return initialValue +(currentValue[1]*this.getPrice(currentValue[0]))

                },0)
                return total.toFixed(2)
                }

    },
    template:`
    
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle" class="cart-close">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>

         
            <tr v-for="(quantity,key,i) in cart":key="i">
          
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{key}}</td>
              <td>\${{ getPrice(key) }}</td>
              <td class="center">{{quantity}}</td>
              <td>\${{quantity* getPrice(key)}}</td> 
              <td class="center">
                <button @click="remove(key)"class="btn btn-light cart-remove">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>



         <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p> 
        <div class="spread">
          <span><strong>Total:</strong> \${{calculateTotal()}}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
    
    `
  })
  
  app.mount('#app')

