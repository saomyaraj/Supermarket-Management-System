
document.getElementById('addnewcustomer').addEventListener('click',function(){
    fetch('/custID')
    .then(response => response.json())
    .then(data=>{
        document.getElementById('newcustID').value = data;

    })

    document.querySelector('.newCustomerBox').classList.add('show')
});
document.getElementById('Cancelbtn2').addEventListener('click',function(){
    document.querySelector('.newCustomerBox').classList.remove('show')
});


let customerID;
document.getElementById('searchicon').addEventListener('click',function(){
    const MobileNo = document.getElementById("existingcustomer").value;
    console.log("mobileno",MobileNo)

    if(MobileNo === ""){
        alert("Please enter a Mobile No")
    }
    else{
        fetch('/searchCustomer',{
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                MobileNo : MobileNo
            })
        }).then(response => response.json())
        .then(data=>{
           console.log(data[0].C_NAME)  
            
           document.getElementById('custID').innerText = 'Customer ID :         '+data[0].C_ID
           customerID = data[0].C_ID
           document.getElementById('custName').innerText = 'Customer Name :        '+data[0].C_NAME
           document.getElementById('custPhone').innerText = 'Customer PhoneNo :       '+data[0].C_MOBILE
           document.querySelector('.existingcustomerbox').classList.add('show2')

        }

        )
    }
})
let nextOid;
document.getElementById('Cancelbtn').addEventListener('click',function(){
    fetch('/getOrderID')
    .then(response => response.json())
    .then(data=>{
        console.log(data[0].ORDER_ID)
        nextOid = parseInt(data[0].ORDER_ID.substr(1)) + 1;
        nextOid = 'O' + nextOid.toString().padStart(3, '0'); // Assuming you want the order ID to have at least 3 digits
        console.log(nextOid);
        document.getElementById('orderId').style.fontStyle = 'italic';

        document.getElementById('orderId').textContent = 'Order' + ' #'+ nextOid ;

    })      
    document.getElementById('custid').textContent  = document.getElementById('custID').innerText.substr(13)
    // document.querySelector('.existingcustomerbox').classList.remove('show2')
})


document.getElementById('addcustomer').addEventListener('click', function () {
    const custID = document.getElementById('newcustID').value;
    const custName = document.getElementById('newcustName').value;
    const custMobileNo = document.getElementById('custMobileNo').value;
    

    fetch('/addCustomer', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            C_ID: custID,
            C_NAME: custName,
            C_MOBILE: custMobileNo
        })
    })
        .then(response => {
            if (response.ok) {

                console.log("done")
                document.getElementById('custid').textContent  = custID

            }
            else {
                alert("error")
            }
        })
        .catch(error => {
            // Handle network errors
            console.error('Error adding product:', error);
            alert("Network error. Please try again later.");
        });

});

let count = 1;
let total = 0;

document.getElementById('addbtn').addEventListener('click', function () {
    const skuID = document.getElementById('skucart').value;
    var qty = document.getElementById('cartqty').value;
    const items = document.querySelector('.items');
    fetch('/itemDetail', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            skuID: skuID
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const item = document.createElement('div');
            item.classList.add('item');
            
            const firstitempart = document.createElement('div');
            firstitempart.classList.add('firstitempart');
            
            const btn = document.createElement('button');
            btn.setAttribute('id', 'addqtybtn');
            btn.textContent = '+';

            
            const name = document.createElement('h2');
            name.textContent = `${count}. ${data[0].PRODUCT_NAME}`;
            count = count + 1;
            
            const skup = document.createElement('p');
            skup.textContent = `SKU: ${data[0].PRODUCT_ID}`;
            
            const seconditempart = document.createElement('div');
            seconditempart.classList.add('seconditempart');
            
            const qtyprice = document.createElement('p');
            qtyprice.textContent = `${qty} X ${data[0].SELLING_PRICE}$`;
            
            const itempricet = document.createElement('p');
            itempricet.textContent = `${qty * data[0].SELLING_PRICE}$`;
            total = total + qty*data[0].SELLING_PRICE
            document.getElementById('total').textContent = `${total}$`

            
            items.appendChild(item);
            item.appendChild(firstitempart);
            firstitempart.append(btn, name, skup);
            item.appendChild(seconditempart);
            seconditempart.append(qtyprice, itempricet);

            btn.addEventListener('click',function(){
                qty = parseInt(qty) + 1;
                qtyprice.textContent = `${qty} X ${data[0].SELLING_PRICE}$`;
                itempricet.textContent = `${qty * data[0].SELLING_PRICE}$`;
                total = total + qty*data[0].SELLING_PRICE
                document.getElementById('total').textContent = `${total}$`


            })
        })
        .catch(error => {
            // Handle network errors
            console.error('Error adding product:', error);
            alert("Network error. Please try again later.");
        });
})
document.getElementById('generateReceipt').addEventListener('click', function() {
    if(customerID === ''){
        alert("Please register the customer")
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-based (0 = January)
    const day = today.getDate();
    
    // Format the date as desired (e.g., YYYY-MM-DD)
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    console.log("Today's date:", formattedDate);
    fetch('/addOrderDetails', 
    {method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({
        customerID:customerID,
        total:total,
        nextOid:nextOid,
        date: formattedDate
    })
    })
    .then(response => {
        if (response.ok) {

            console.log("done")
            window.location.href = `/payment?orderID=${nextOid}`


        }
        else {
            alert("error")
        }
    })
    .catch(error => {
        // Handle network errors
        console.error('Error adding product:', error);
        alert("Network error. Please try again later.");
    });


});




