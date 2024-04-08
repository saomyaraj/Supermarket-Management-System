document.querySelectorAll('#dltbtn').forEach(function(deleteBtn) {
    deleteBtn.addEventListener('click', function() {
        // Find the row
        const row = this.parentNode.parentNode;
        const EMP_ID = row.querySelector('#EMP_ID').textContent; // Assuming you have a class 'product-id' for the cell containing the product ID

        // Send a POST request to delete the product
        fetch('/deleteEMP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ EMP_ID: EMP_ID })
        })
        .then(response => {
            if (response.ok) {
                row.remove();

                // Remove the row from the table
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    });
});


document.getElementById('searchInput').addEventListener('input',function(){
    const empsearch = document.getElementById('searchInput').value.toUpperCase().trim();
    let tableBody = document.getElementById('productTableBody')

    let rows = tableBody.querySelectorAll('tr')

    if(empsearch === ""){
        rows.forEach((row)=>{
           row.classList.remove('highlight');  
        })}
        else{
            rows.forEach((row)=>{
                if(row.querySelector('td:nth-child(2)').textContent.toUpperCase().includes(empsearch)){
                    row.classList.add('highlight');
                }
                else{
                    row.classList.remove('highlight');
                }

            })
            }

        }
)