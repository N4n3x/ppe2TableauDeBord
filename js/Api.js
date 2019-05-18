class App{
  constructor(){
    this.cnx = new Connexion();
    this.content = document.getElementById("content");
    this.table = document.getElementById("dataContent");
    this.form = document.getElementById("formulaire");
  }

  LoadVehicle(){
    this.content.style.justifyContent = "unset";
    this.table.innerHTML = "";
    this.vehicle = new Vehicle();
  }

  LoadUser(){
    this.content.style.justifyContent = "unset";
    this.table.innerHTML = "";
    this.user = new User();
  }

  LoadUsage(){
    this.content.style.justifyContent = "unset";
    this.table.innerHTML = "";
    this.usage = new Usage();
  }
}

class Usage{
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayUsages();
  }

  async GetUsages(){
    await this.req.Get("usages");
    this.listUsages = this.req.json;
  }

  PutUsage(uri, json){
    this.req.Put(uri, json, app.cnx.token).then(
      data => app.usage.DisplayUsages()
      
    );
    app.form.style.display = "none";
    return this.result;
  }

  PostUsage(uri, json){
    this.req.Post(uri, json, app.cnx.token).then(
      data => app.usage.DisplayUsages()
    );
    app.form.style.display = "none";
    return this.result;
  }

  DeleteUsage(uri){
    this.req.Delete(uri, app.cnx.token).then(
      data => app.usage.DisplayUsages()
    );
  }

  async DisplayUsages(){
    if(document.getElementById("tableUsage")){
      document.getElementById("tableUsage").remove();
    }
    this.table = new Table("dataContent", "tableUsage");
    this.table.AddHeader([
      "Début",
      "Fin",
      "Objet",
      "Description",
      "Véhicule",
      "Utilisateur",
      "<button class='btnAdd' onclick='app.usage.OnClickAdd()'>+</button>"
    ]);
    await this.GetUsages("usages");
    let table = this.table;
    this.listUsages.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.start,
          element.end,
          element.purpose,
          element.description,
          element.vehicle.registration,
          element.user.name,
          table.AddButton(element._id, "Editer", this.OnClickEdit),
          table.AddButton(element._id, "Supprimer", this.Delete)
        ]
        );
      
    });
  }

  OnClickAdd(){
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.usage.form = new Form("formulaire", [
      {"nom": "start", "type": "text", "value": "Début (jj/mm/aaaa hh:mm)"},
      {"nom": "end", "type": "text", "value": "Fin (jj/mm/aaaa hh:mm)"},
      {"nom": "purpose", "type": "text", "value": "Objet"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "vehicle", "type": "text", "value": "Vehicule"},
      {"nom": "user", "type": "text", "value": "Utilisateur"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.usage.Add}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }

  OnClickEdit(e){
    console.log(e);
    app.usage.curId = e.id;
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.usage.form = new Form("formulaire", [
      {"nom": "start", "type": "text", "value": "Début (jj/mm/aaaa hh:mm)"},
      {"nom": "end", "type": "text", "value": "Fin (jj/mm/aaaa hh:mm)"},
      {"nom": "purpose", "type": "text", "value": "Objet"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "vehicle", "type": "text", "value": "Vehicule"},
      {"nom": "user", "type": "text", "value": "Utilisateur"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.usage.Edit}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }

  Edit(json){
    app.usage.PutUsage("usages/"+app.usage.curId, json);
  }

  Add(json){
    app.usage.PostUsage("auth/register", json);
  }

  Delete(e){
    app.usage.DeleteUsage("usages/"+e.id)
  }

  Suppr(e){
    console.log(e.id);
  }
}

class User{
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayUsers();
  }

  async GetUsers(){
    await this.req.Get("users");
    this.listUsers = this.req.json;
  }

  PutUser(uri, json){
    this.req.Put(uri, json, app.cnx.token).then(
      data => app.user.DisplayUsers()
      
    );
    app.form.style.display = "none";
    return this.result;
  }

  PostUser(uri, json){
    this.req.Post(uri, json, app.cnx.token).then(
      data => app.user.DisplayUsers()
    );
    app.form.style.display = "none";
    return this.result;
  }

  DeleteUser(uri){
    this.req.Delete(uri, app.cnx.token).then(
      data => app.user.DisplayUsers()
    );
  }

  async DisplayUsers(){
    if(document.getElementById("tableUser")){
      document.getElementById("tableUser").remove();
    }
    this.table = new Table("dataContent", "tableUser");
    this.table.AddHeader([
      "Nom",
      "Email",
      "Rôle",
      "<button class='btnAdd' onclick='app.user.OnClickAdd()'>+</button>"
    ]);
    await this.GetUsers("users");
    let table = this.table;
    this.listUsers.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.name,
          element.email,
          element.role.name,
          table.AddButton(element._id, "Editer", this.OnClickEdit),
          table.AddButton(element._id, "Supprimer", this.Delete)
        ]
        );
      
    });
  }

  OnClickAdd(){
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.user.form = new Form("formulaire", [
      {"nom": "name", "type": "text", "value": "Nom"},
      {"nom": "email", "type": "text", "value": "Email"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "role", "type": "text", "value": "Rôle"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.user.Add}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }

  OnClickEdit(e){
    console.log(e);
    app.user.curId = e.id;
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.user.form = new Form("formulaire", [
      {"nom": "name", "type": "text", "value": "Nom"},
      {"nom": "email", "type": "text", "value": "Email"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "role", "type": "text", "value": "Rôle"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.user.Edit}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }

  Edit(json){
    app.user.PutUser("users/"+app.user.curId, json);
  }

  Add(json){
    app.user.PostUser("auth/register", json);
  }

  Delete(e){
    app.user.DeleteUser("users/"+e.id)
  }

  Suppr(e){
    console.log(e.id);
  }
}

class Vehicle{
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayVehicles();
  }

  async GetVehicles(){
    await this.req.Get("vehicles");
    this.listVehicles = this.req.json;
  }

  PutVehicle(uri, json){
    this.req.Put(uri, json, app.cnx.token).then(
      data => app.vehicle.DisplayVehicles()
      
    );
    app.form.style.display = "none";
    return this.result;
  }

  PostVehicle(uri, json){
    this.req.Post(uri, json, app.cnx.token).then(
      data => app.vehicle.DisplayVehicles()
    );
    app.form.style.display = "none";
    return this.result;
  }

  DeleteVehicle(uri){
    this.req.Delete(uri, app.cnx.token).then(
      data => app.vehicle.DisplayVehicles()
    );
  }

  async DisplayVehicles(){
    if(document.getElementById("tableVehicle")){
      document.getElementById("tableVehicle").remove();
    }
    this.table = new Table("dataContent", "tableVehicle");
    this.table.AddHeader([
      "Immatriculation",
      "Description",
      "Autonomie",
      "Energie",
      "Place",
      "<button class='btnAdd' onclick='app.vehicle.OnClickAdd()'>+</button>"
    ]);
    await this.GetVehicles("vehicles");
    let table = this.table;
    this.listVehicles.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.registration,
          element.description,
          element.range,
          element.energy,
          element.place,
          table.AddButton(element._id, "Editer", this.OnClickEdit),
          table.AddButton(element._id, "Supprimer", this.Delete)
        ]
        );
      
    });
  }

  OnClickAdd(){
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.vehicle.form = new Form("formulaire", [
      {"nom": "registration", "type": "text", "value": "Immatriculation"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "range", "type": "number", "value": "Autonomie"},
      {"nom": "energy", "type": "text", "value": "Energie"},
      {"nom": "place", "type": "number", "value": "Place"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.vehicle.Add}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }

  OnClickEdit(e){
    console.log(e);
    app.vehicle.curId = e.id;
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.vehicle.form = new Form("formulaire", [
      {"nom": "registration", "type": "text", "value": "Immatriculation"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "range", "type": "number", "value": "Autonomie"},
      {"nom": "energy", "type": "text", "value": "Energie"},
      {"nom": "place", "type": "number", "value": "Place"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.vehicle.Edit}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }

  Edit(json){
    app.vehicle.PutVehicle("vehicles/"+app.vehicle.curId, json);
  }

  Add(json){
    app.vehicle.PostVehicle("vehicles", json);
  }

  Delete(e){
    app.vehicle.DeleteVehicle("vehicles/"+e.id)
  }

  Suppr(e){
    console.log(e.id);
  }
}

class Connexion{
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.form = new Form("formulaire", [
      {"nom": "title", "type": "label", "value": "Connexion"},
      {"nom": "email", "type": "text", "value": "Identifiant"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "btnSubmit", "type": "button", "value": "Connexion", "onclick": this.Req}
    ]);
    this.token = "";
  }

  async Req(json){
    let req = new ApiInterface("http://151.80.190.149:8005/");
    await req.Post("auth/sign_in", json);
    if(req.json.token){
      app.cnx.token = req.json.token;
      app.cnx.OnConnected();
      
    }else{
      app.cnx.form.Error(req.json.message);
    }
    //console.log(cnx.token);
  }

  OnConnected(){
    let btnDisconnect = document.getElementById("btnDisconnect");
    let form = document.getElementById("formulaire");
    form.style.display = "none";
    form.innerHTML = "";
    var dataNav = [
      {
          innerHTML:"Véhicules",
          type:"button",
          id:"btnVehicle",
          onClick:"app.LoadVehicle()"
      },
      {
          innerHTML:"Utilisateurs",
          type:"button",
          id:"btnUser",
          onClick:"app.LoadUser()"
      },
      {
          innerHTML:"Réservations",
          type:"button",
          id:"btnReservation",
          onClick:"app.LoadUsage()"
      },
      {
          innerHTML:"Déconnexion",
          type:"button",
          id:"btnDeconnexion",
          onClick: "app.cnx.Disconnect()"
      }
    ];
    this.nav = new Navigation('nav',dataNav);
  }

  Disconnect(){
    app.cnx.token = "";
    let content = document.getElementById("dataContent");
    let form = document.getElementById("formulaire");
    let nav = document.getElementById("nav");
    document.getElementById("content").style.justifyContent = "center";
    content.innerHTML = "";
    form.innerHTML = "";
    nav.innerHTML = "";
    app.cnx.form = new Form("formulaire", [
      {"nom": "title", "type": "label", "value": "Connexion"},
      {"nom": "email", "type": "text", "value": "Identifiant"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "btnSubmit", "type": "button", "value": "Connexion", "onclick": this.Req}
    ]);
    form.style.display = "flex";

  }


}

class Form{
  constructor(domTargetId, json){
    this.domTarget = document.getElementById(domTargetId);
    this.data = json;
    this.InitForm();
  }

  InitForm(){
    // this.form = document.createElement("FORM");
    // this.form.id = this.id;
    // this.domTarget.appendChild(this.form);
    let form = this;
    this.data.forEach(function(e){
      let input = form.CreateInput(e);
      form.domTarget.appendChild(input);
    })
  }

  CreateInput(data){
    let input;
    switch(data.type){
      case "text":
        input = document.createElement("INPUT");
        input.name = data.nom;
        input.type = data.type;
        input.classList.add("inputText");
        input.placeholder = data.value;
      break;
      case "number":
        input = document.createElement("INPUT");
        input.name = data.nom;
        input.type = data.type;
        input.classList.add("inputNumber");
        input.placeholder = data.value;
      break;
      case "password":
        input = document.createElement("INPUT");
        input.name = data.nom;
        input.type = data.type;
        input.classList.add("inputPw");
        input.placeholder = data.value;
      break;
      case "button":
        input = document.createElement("BUTTON");
        input.id = data.nom;
        input.classList.add("btnSubmit");
        let form = this;
        input.addEventListener("click", function(e){
          e.preventDefault();
          form.OnSubmit(data.onclick);
        });
        input.innerHTML = data.value;
      break;
      case "label":
        input = document.createElement("LABEL");
        input.id = data.nom;
        input.classList.add("label");
        input.innerHTML = data.value;
      break;
    }
    //console.log(input);
    return input;
  }

  OnSubmit(callback){
    let res = this.ToJson(this.domTarget);
    callback(res);
  }

  ToJson(form){
    var field = [];
    var s = {};
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (let i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (let j=form.elements[i].options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            //s[encodeURIComponent(field.name)] = encodeURIComponent(field.options[j].value);
                            s[field.name] = field.options[j].value;
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    if(field.value != ""){
                      //s[encodeURIComponent(field.name)] = encodeURIComponent(field.value);
                      s[field.name] = field.value;
                    }
                }
            }
        }
    }
    return JSON.stringify(s);
  }

  Error(msg){
    if(document.getElementById("errorMsg")){
      let textError = document.getElementById("errorMsg");
      textError.innerHTML = msg;
    }else{
      let textError = document.createElement("SPAN");
      textError.innerHTML = msg;
      textError.id = "errorMsg";
      textError.style.border = "3px solid red";
      this.domTarget.appendChild(textError);
    }
  }
}

class Table{
  constructor(domTargetId, id){
    this.id = id;
    this.domTarget = document.getElementById(domTargetId);
    this.InitTable();
  }

  InitTable(){
    this.domContent = document.getElementById("content");
    this.contentTable = document.createElement('DIV');
    this.contentTable.id = "content" + this.id;
    this.domTarget.appendChild(this.contentTable);
    this.table = document.createElement('TABLE');
    this.table.id = this.id;
    this.contentTable.appendChild(this.table);
  }

  AddHeader(array){
    this.thead = document.createElement("THEAD");
    this.table.appendChild(this.thead);
    let rowTH = document.createElement("TR");
    this.thead.appendChild(rowTH);
    array.forEach(function(e){
      let cellHead = document.createElement("TH");
      cellHead.innerHTML = e;
      rowTH.appendChild(cellHead);
    })
  }

  AddRow(array){
    let table = this;
    let row = document.createElement("TR");
    array.forEach(function(e){
      row.appendChild(table.AddCell(e));
    })
    this.table.appendChild(row);
  }

  AddCell(content){
    //console.log(content);
    let cell = document.createElement("TD");
    if(typeof content === "object"){
      cell.appendChild(content);
    }else if(typeof content === "number"){
      cell.innerHTML = content;
    }else if(moment(content).isValid()){
      let date = moment(content);
      cell.innerHTML = date.format("DD/MM/YYYY hh:mm");
    }else{
      cell.innerHTML = content;
    }
    
    return cell;
  }

  AddButton(id, value, onclick){
    let btn = document.createElement("BUTTON");
    btn.type = "button";
    btn.addEventListener("click", function(){
      onclick(this);
    });
    btn.id = id;
    btn.innerHTML = value;
    return btn;
  }

}

class ApiInterface{
    
    constructor(url){
      this.url = url;
    }

    async Get (uri){
      this.response = await fetch(this.url + uri);
      this.json = await this.response.json();
    }

    async Put(uri, json, token = ""){
      this.response = await fetch(this.url + uri, {
        method: "put",
        body: json,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+token
        }
      });
      this.json = await this.response.json();
      return this.json;
    }

    async Post(uri, json, token = ""){
      this.response = await fetch(this.url + uri, {
        method: "post",
        body: json,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+token
        }
      });
      this.json = await this.response.json();
    }

    async Delete(uri, token = ""){
      this.response = await fetch(this.url + uri, {
        method: "delete",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+token
        }
      });
      this.json = await this.response.json();
    }
}