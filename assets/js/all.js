"use strict";

//DOM
var tableList = document.querySelector('.js-table');
var delAll = document.querySelector('.js-delAll'); //全域變數

var api_path = "chun-chia";
var token = {
  headers: {
    authorization: "DW4Cy62MZCRYaSzxl2IyiqqFl8V2"
  }
}; //畫圖

function piechart(data) {
  //全產品類別營收比重
  var pieObj = {};
  data.forEach(function (item) {
    item.products.forEach(function (i) {
      if (pieObj[i.category] === undefined) {
        pieObj[i.category] = parseInt(i.quantity);
      } else {
        pieObj[i.category] += parseInt(i.quantity);
      }
    });
  });
  console.log(pieObj);
  var pieData = [];
  Object.keys(pieObj).forEach(function (item) {
    pieData.push([item, pieObj[item]]);
  });
  console.log(pieData);
  var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: pieData,
      type: 'pie'
    }
  }); //全品項營收比重

  var categroyObj = {};
  data.forEach(function (item) {
    item.products.forEach(function (i) {
      if (categroyObj[i.title] === undefined) {
        categroyObj[i.title] = parseInt(i.quantity);
      } else {
        categroyObj[i.title] += parseInt(i.quantity);
      }
    });
  });
  console.log(categroyObj);
  var categroyArray = Object.keys(categroyObj);
  var categoryArrayObj = [];
  categroyArray.forEach(function (item) {
    categoryArrayObj.push({
      name: item,
      value: categroyObj[item]
    });
  }); //console.log(categoryArrayObj);
  //依照數量排大小，由大至小

  categoryArrayObj.sort(function (a, b) {
    return b.value - a.value;
  }); //console.log(categoryArrayObj)
  //把數量前三個提出，之後全部加到其他

  var newcategoryArrayObj = [{
    name: "其他",
    value: 0
  }];
  categoryArrayObj.forEach(function (item, index) {
    var number = 0;

    if (index < 3) {
      newcategoryArrayObj.push({
        name: item.name,
        value: item.value
      }); //categoryData.push([item.name,item.value])
    } else {
      newcategoryArrayObj[0].value += item.value;
    }
  });
  console.log(newcategoryArrayObj); //組成畫圖的資料

  var categoryData = [];
  newcategoryArrayObj.forEach(function (item) {
    categoryData.push([item.name, item.value]);
  });
  console.log(categoryData);
  var chart2 = c3.generate({
    bindto: '#chartCategory',
    data: {
      columns: categoryData,
      type: 'pie'
    }
  });
} //取得資料


function getOrderData() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), token).then(function (response) {
    console.log(response.data);
    render(response.data.orders);
  })["catch"](function (error) {
    console.log(error);
  });
}

function tellPaid(data) {
  if (data.paid === false) {
    return "未完成";
  } else {
    return "已完成";
  }
}

function showPorductListAndNum(data) {
  var content = '';
  data.products.forEach(function (item, index) {
    content += "".concat(index + 1, ". \u54C1\u540D\uFF1A").concat(item.title, " \u6578\u91CF\uFF1A").concat(item.quantity, "<br>");
  });
  return content;
}

function renderList(data) {
  var Today = new Date();
  var content = "<thead>\n<tr>\n    <th>\u8A02\u55AE\u7DE8\u865F</th>\n    <th>\u806F\u7D61\u4EBA</th>\n    <th>\u806F\u7D61\u5730\u5740</th>\n    <th>\u96FB\u5B50\u90F5\u4EF6</th>\n    <th>\u8A02\u55AE\u54C1\u9805</th>\n    <th>\u8A02\u55AE\u65E5\u671F</th>\n    <th>\u8A02\u55AE\u72C0\u614B</th>\n    <th>\u64CD\u4F5C</th>\n</tr>\n</thead>";
  data.forEach(function (item) {
    content += "<tr>\n    <td>".concat(item.createdAt, "</td>\n    <td>\n      <p>").concat(item.user.name, "</p>\n      <p>").concat(item.user.tel, "</p>\n    </td>\n    <td>").concat(item.user.address, "</td>\n    <td>").concat(item.user.email, "</td>\n    <td>\n      <p>").concat(showPorductListAndNum(item), "</p>\n    </td>\n    <td>").concat(Today.getFullYear(), "/").concat(Today.getMonth() + 1, "/").concat(Today.getDate(), "</td>\n    <td class=\"orderStatus\">\n      <a href=\"#\" class=\"text-nowrap\" orderID=").concat(item.id, " paid=").concat(item.paid, ">").concat(tellPaid(item), "</a>\n    </td>\n    <td>\n      <input type=\"button\" class=\"delSingleOrder-Btn\" del=\"true\" orderID=").concat(item.id, " value=\"\u522A\u9664\">\n    </td>\n</tr>");
  });
  tableList.innerHTML = content;
} //更改訂單狀態


function changeOrderStatus(e) {
  e.preventDefault();
  var sendData = {
    "data": {
      "id": "",
      "paid": null
    }
  }; //console.log(e.target.getAttribute('paid'))
  //console.log(e.target.getAttribute('orderID'))

  if (e.target.getAttribute('paid')) {
    if (e.target.getAttribute('paid') === "false") {
      sendData.data.paid = true;
    } else {
      sendData.data.paid = false;
    }

    sendData.data.id = e.target.getAttribute('orderID'); //console.log(sendData)

    axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), sendData, token).then(function (response) {
      render(response.data.orders);
    })["catch"](function (error) {
      console.log(error);
    });
  } else {
    return;
  }
} //刪除單筆訂單


function delOrder(e) {
  e.preventDefault();
  var del = '';

  if (e.target.getAttribute('del')) {
    del = e.target.getAttribute('orderID');
    axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(del), token).then(function (response) {
      render(response.data.orders);
    })["catch"](function (error) {
      console.log(error);
    });
  }
} //刪除有有訂單


function delAllOrder(e) {
  e.preventDefault();

  if (e.target.getAttribute('delAll')) {
    axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/"), token).then(function (response) {
      render(response.data.orders);
    })["catch"](function (error) {
      console.log(error);
    });
  }
} //功能集成


function render(data) {
  piechart(data);
  renderList(data);
}

function init() {
  getOrderData();
}

init();
tableList.addEventListener('click', changeOrderStatus, false);
tableList.addEventListener('click', delOrder, false);
delAll.addEventListener('click', delAllOrder, false);
//# sourceMappingURL=all.js.map
