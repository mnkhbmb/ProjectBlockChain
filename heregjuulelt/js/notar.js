var app = new Vue({
  el: '#app',
  data: {
    etherscanLink:"",
    hash:"",
    name:"",
    lastModified:"",
    size:"",
    type:"",
    error: "",
    tx: "",
    web3Missing: false,
    animate: false,
    upload_visible: false,
    dragging: false
  },
  mounted:function(){
   setTimeout(function() {
      //console.log('here', web3.eth.accounts, web3.eth.accounts.length);
      if (typeof web3 === 'undefined') {
        app.web3Missing = true;
      } 
   }, 1000);   
  },
  methods: {
    display_upload: function() {
      window.scrollTo(0,0);
      app.upload_visible = true;
    },
    cancel_upload: function() {
      app.upload_visible = false;
      app.hash = "";
      app.name = "";
      app.lastModified = "";
      app.size = "";
      app.type = "";
      app.error =  "";
      app.tx="";
      app.animate = false
   },
    create_contract: function () {
      // `this` inside methods points to the Vue instance

      if (web3.eth.accounts.length === 0) {
        alert("Аккуант олдсонгүй!");
        return;
      }
      app.error="";

      console.log("Гэрээг үүсгэж байна,", web3.eth.accounts[0]);
      var nottarioContract = web3.eth.contract(abi);
      var nottario =nottarioContract.new( this.hash, this.name, this.type, this.size, this.lastModified, {from:web3.eth.accounts[0], data: bin, gas: 600000, value: 10000000000000000}, function(err,data) {
        console.log(err, data);
        if (err)  {
            setInterval(function(){
              web3.eth.getTransactionReceipt(app.tx , function(err,d){ 
                if(!err && d.contractAddress) {
                  window.location = 'geree.html#' + d.contractAddress;
                }
              });
            }, 2000);
        } else {
          if (data.address) {
            window.location = 'geree.html#' + data.address;
          } else {
            app.tx = data.transactionHash;
            app.animate = true;
            app.etherscanLink = "https://ropsten.etherscan.io/tx/" + app.tx;
          }
        }
      });// `event` is the native DOM event
    }
  }
})

function allowDrop(ev) {
  ev.preventDefault();
  app.dragging = true;
}

function dragout(ev) {
  console.log('чирэж байна.');
  app.dragging=false;
}

function drop_handler(ev) {
  //console.log("Доошоо");
  ev.preventDefault();
  app.dragging=false;
  console.log('ev ', ev);
  var f = ev.dataTransfer.files[0];
  if (!f) {
    return alert('Файлын метадата алдаатай!!!');
  }
  console.log ("Файл бол " , f);
  app.lastModified = f.lastModified;
  app.name = f.name.substr(0,32);
  app.size = f.size;
  app.type = f.type.substr(0,32);
  if(app.type == "application/pdf" | app.type == "application/vnd.openxmlformats-o" | app.type == "image/png"){
    //app.type = f.type.substr(0,32);
    var reader = new FileReader();
    reader.onload = function(event) {
    //console.log('onload!',event);
    app.hash = web3.sha3(event.target.result);
    console.log("хэш нь" + app.hash);
  };
  } else {
    alert("Манай энэхүү систем зөвхөн pdf,docx,png өргөтгөлтэй файл дэмжинэ!!!");
  }
  reader.readAsText(f);
}


