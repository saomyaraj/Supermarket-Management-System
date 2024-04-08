document.getElementById('addNewProductBtn').addEventListener('click', function() {
    // Create a new row
    document.querySelector('.newProductBox').classList.add("show");

    // var newRow = document.createElement('tr');
    
    // // Add input fields to the row
    // newRow.innerHTML = `
    //     <td><input type="text" placeholder="Product Name"></td>
    //     <td><input type="text" placeholder="Category"></td>
    //     <td><input type="text" placeholder="SKU"></td>
    //     <td><input type="text" placeholder="Quantity"></td>
    //     <td><input type="text" placeholder="Cost"></td>
    //     <td><input type="text" placeholder="Price"></td>
    //     <td>
    //         <button class="saveBtn">Save</button>
    //         <button class="cancelBtn">Cancel</button>
    //     </td>
    // `;
    
    // Append the new row to the table body
    // document.getElementById('productTableBody').appendChild(newRow);
});
document.getElementById('Cancelbtn2').addEventListener('click',function(){
    document.querySelector('.newProductBox').classList.remove("show");
})
document.getElementById('addproduct').addEventListener('click',function(){
    const productname = document.getElementById('productname').value
    const categoryname = document.getElementById('categoryname')
    const selectedIndex = categoryname.selectedIndex;
    const selectedOption = categoryname.options[selectedIndex];
    const selectedText = selectedOption.innerText;
    const sku = document.getElementById('sku').value
    const qty = document.getElementById('qty').value
    const cost = document.getElementById('cost').value
    const price = document.getElementById('price').value
    
        var newRow = document.createElement('tr');
    
    // Add input fields to the row
    newRow.innerHTML = `
        <td>${productname}</td>
        <td>${selectedText}</td>
        <td>${sku}</td>
        <td>${qty}</td>
        <td>${cost}</td>
        <td>${price}</td>
        <td>
        <button id="actionbtn">Edit</button>
        <button id="actionbtn">Delete</button>
        </td>
    `;
    
    // Append the new row to the table body
    document.getElementById('productTableBody').appendChild(newRow);

})
// Event listener for Save button click
document.getElementById('productTableBody').addEventListener('click', function(event) {
    if (event.target.classList.contains('saveBtn')) {
        const row = event.target.parentNode.parentNode;
        const inputs = row.querySelectorAll('input');
        
        // Replace input fields with text displaying entered values
        inputs.forEach(input => {
            const textNode = document.createTextNode(input.value);
            input.parentNode.replaceChild(textNode, input);
        });

        // Replace Save and Cancel buttons with Edit and Delete buttons
        const saveBtn = row.querySelector('.saveBtn');
        const cancelBtn = row.querySelector('.cancelBtn');
        saveBtn.parentNode.innerHTML = `<button class="editBtn">Edit</button><button class="deleteBtn">Delete</button>`;
    }
});


document.getElementById('Createcategory').addEventListener('click',function(){
    document.querySelector('.categorybox').classList.add('show');
})
document.querySelector('#Cancelbtn').addEventListener('click',function(){
    document.querySelector('.categorybox').classList.remove('show');

})
document.querySelector('#entercategory').addEventListener('click',function(){
    
    const categoryName = document.getElementById('Categoryinput').value;
    if (categoryName.trim() === "") {
        alert("Please enter a category name.");
        return;
    }

    fetch('/addCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryName: categoryName })
    })
    .then(response => {
        if (response.ok) {
            // Category added successfully, you can handle the response here
            document.querySelector('.categorybox').style.display = 'none';

        } else {
            // Handle errors
            alert("Error adding category. Please try again later.");
        }
    })
    .catch(error => {
        // Handle network errors
        console.error('Error adding category:', error);
        alert("Network error. Please try again later.");
    });
});


document.querySelectorAll('#dltbtn').forEach(function(deleteBtn) {
    deleteBtn.addEventListener('click', function() {
        // Find the row
        const row = this.parentNode.parentNode;
        const productId = row.querySelector('#PRODUCT_ID').textContent; // Assuming you have a class 'product-id' for the cell containing the product ID

        // Send a POST request to delete the product
        fetch('/deleteProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId })
        })
        .then(response => {
            if (response.ok) {
                // Remove the row from the table
                row.remove();
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('productTableBody');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toUpperCase().trim();
        const rows = tableBody.querySelectorAll('tr');

        if (searchTerm === '') {
            // If search term is empty, remove highlight from all rows
            rows.forEach(row => {
                row.classList.remove('highlight');
            });
        } else {
            // If search term is not empty, highlight rows containing the search term
            rows.forEach(row => {
                const productName = row.querySelector('td:first-child').textContent.toUpperCase();
                if (productName.includes(searchTerm)) {
                    row.classList.add('highlight');
                } else {
                    row.classList.remove('highlight');
                }
            });
        }
    });
});
