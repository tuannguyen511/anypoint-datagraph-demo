const orderSelect = document.getElementById('order-select')
const productList = document.getElementById('products-list')
const columnsName = ["Product Code","Product Name","Product Description","Product Line","Product Vendor","Quantity","Price"]
const cols = ["productCode","productName","productDescription","productLine","productVendor"]

queryFetch(`
  query {
    orders(limit: 50, offset: 0) {
      orderNumber
    }
  }
`).then(data => {
  data.data.orders.forEach(order => {
    const option = document.createElement('option')
    option.value = order.orderNumber
    option.innerText = order.orderNumber
    orderSelect.append(option)
  })
})

orderSelect.addEventListener('change', async e => {
  const orderNumber = e.target.value
  const order = await getOrderById(orderNumber)

  // render order info
  document.getElementById("orderNumber").innerText = order.orderNumber
  document.getElementById("shippedDate").innerText = order.shippedDate
  document.getElementById("orderDate").innerText = order.orderDate
  document.getElementById("requiredDate").innerText = order.requiredDate
  document.getElementById("customerNumber").innerText = order.customerNumber
  document.getElementById("comments").innerText = order.comments

  // render products info
  productList.innerHTML=''
  var table = document.createElement("table");
  var header = table.insertRow(-1);

  for (var i = 0; i < columnsName.length; i++) {
    // Create the table header th element
    var theader = document.createElement("th");
    theader.innerHTML = columnsName[i];
    // Append columnName to the table row
    header.appendChild(theader);
  }
  
  // Adding the data to the table
  for (var i = 0; i < order.products.length; i++) {
    // Create a new row
    trow = table.insertRow(-1);
    for (var j = 0; j < cols.length; j++) {
      var cell = trow.insertCell(-1);
      
      // Inserting the cell at particular place
      cell.innerHTML = order.products[i]['product'][cols[j]];
    }
    var quantitycell = trow.insertCell(-1);
    quantitycell.innerHTML = order.products[i]['quantity'];
    var pricecell = trow.insertCell(-1);
    pricecell.innerHTML = order.products[i]['price'];
  }
  
  productList.appendChild(table)
})



function getOrderById(orderNumber) {
  return queryFetch(`
    query queryorderbyid($id: String!) {
      ordersByOrderNumber(orderNumber: $id) {
        orderNumber
        shippedDate
        orderDate
        requiredDate
        customerNumber
        comments
        products {
          price
          quantity
          product {
            productCode
            productName
            productDescription
            productLine
            productVendor
            quantityInStock
            price
          }
        }
      }
    }
  `, { id: orderNumber }).then(data => {
    return data.data.ordersByOrderNumber
  })
}

function queryFetch(query, variables) {
  return fetch('https://datagraph-89924bcb-67e2-872c2f78-f3cc.us-e2.cloudhub.io/graphql', {
    method: 'POST',
    headers: { "Content-Type": "application/json" ,
               "client_id": "e52d68ebf81248e0969c503081eddb23",
               "client_secret": "1bb9e38B2A75456bbD35a743FcE5aF5d"},
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }).then(res => res.json())
}