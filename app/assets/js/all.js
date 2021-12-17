//DOM

const tableList = document.querySelector('.js-table');
const delAll = document.querySelector('.js-delAll');



//全域變數

const api_path = "chun-chia";
const token = { headers: { authorization: "DW4Cy62MZCRYaSzxl2IyiqqFl8V2" } };

//畫圖
function piechart(data) {

  const pieObj = {};
  data.forEach((item) => {

    item.products.forEach((i) => {
      if (pieObj[i.category] === undefined) {
        pieObj[i.category] = parseInt(i.quantity)
      }
      else {
        pieObj[i.category] += parseInt(i.quantity)
      }
    })

  })
  console.log(pieObj)
  let pieData = [];

  Object.keys(pieObj).forEach((item) => {
    pieData.push([item, pieObj[item]])
  })
  console.log(pieData)

  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns:pieData,
      type: 'pie',

    }
  });

}
//取得資料
function getOrderData() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, token).then((response) => {
    console.log(response.data)
    render(response.data.orders)
  }).catch((error) => { console.log(error) })
}

function tellPaid(data) {
  if (data.paid === false) {
    return "未完成"
  }
  else {
    return "已完成"
  }
}

function showPorductListAndNum(data) {
  let content = '';
  data.products.forEach((item, index) => {
    content += `${index + 1}. 品名：${item.title} 數量：${item.quantity}<br>`
  })
  return content
}

function renderList(data) {
  const Today = new Date();
  let content = `<thead>
<tr>
    <th>訂單編號</th>
    <th>聯絡人</th>
    <th>聯絡地址</th>
    <th>電子郵件</th>
    <th>訂單品項</th>
    <th>訂單日期</th>
    <th>訂單狀態</th>
    <th>操作</th>
</tr>
</thead>`;

  data.forEach((item => {
    content += `<tr>
    <td>${item.createdAt}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      <p>${showPorductListAndNum(item)}</p>
    </td>
    <td>${Today.getFullYear()}/${(Today.getMonth() + 1)}/${Today.getDate()}</td>
    <td class="orderStatus">
      <a href="#" class="text-nowrap" orderID=${item.id} paid=${item.paid}>${tellPaid(item)}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" del="true" orderID=${item.id} value="刪除">
    </td>
</tr>`
  }));
  tableList.innerHTML = content;
}
//更改訂單狀態
function changeOrderStatus(e) {
  e.preventDefault()

  const sendData = {
    "data": {
      "id": "",
      "paid": null
    }
  }
  //console.log(e.target.getAttribute('paid'))
  //console.log(e.target.getAttribute('orderID'))
  if (e.target.getAttribute('paid')) {
    if (e.target.getAttribute('paid') === "false") {
      sendData.data.paid = true;
    }
    else {
      sendData.data.paid = false;
    }
    sendData.data.id = e.target.getAttribute('orderID')
    //console.log(sendData)
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, sendData, token).then((response) => {
      render(response.data.orders)
    }).catch((error) => {
      console.log(error)
    })
  }
  else {
    return
  }


}

//刪除單筆訂單
function delOrder(e) {
  e.preventDefault()

  let del = '';

  if (e.target.getAttribute('del')) {
    del = e.target.getAttribute('orderID')
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${del}`, token).then((response) => {
      render(response.data.orders)
    }).catch((error) => {
      console.log(error)
    })
  }
}
//刪除有有訂單
function delAllOrder(e) {
  e.preventDefault()
  if (e.target.getAttribute('delAll')) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/`, token).then((response) => {
      render(response.data.orders)
    }).catch((error) => {
      console.log(error)
    })
  }
}

//功能集成
function render(data){
  piechart(data);
  renderList(data);
}
function init() {
  getOrderData()

}



init()

tableList.addEventListener('click', changeOrderStatus, false);
tableList.addEventListener('click', delOrder, false);
delAll.addEventListener('click', delAllOrder, false);