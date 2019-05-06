class User{
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayUsers();
  }

  async GetUsers(){
    await this.req.Get("users");
    this.listUsers = this.req.json;
  }

  async PutUsers(uri, json){
    await this.req.Put(uri, json);
    this.result = req.json;
  }

  async DisplayUsers(){
    this.table = new Table("userContent", "tableUser");
    this.table.AddHeader(["Immatriculation", "Début", "Fin", "Objet", "Description"]);
    await this.GetUsers("user");
    let table = this.table;
    this.listUsers.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.name,
          element.email,
          element.role.name,
          table.AddButton(element._id, "Editer", this.Edit),
          table.AddButton(element._id, "Supprimer", this.Suppr)
        ]
        );
      
    });
  }

  Edit(e){
    console.log(e.id);
    let json = {
      "description" : "twingo"
    }
    v.PutUsages("users/" + e.id, json);
  }

  Suppr(e){
    console.log(e.id);
  }
}

class Usage{
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayUsages();
  }

  async GetUsages(){
    await this.req.Get("usages/now");
    this.listUsages = this.req.json;
  }

  async PutUsages(uri, json){
    await this.req.Put(uri, json);
    this.result = req.json;
  }

  async DisplayUsages(){
    this.table = new Table("usageContent", "tableUsage");
    this.table.AddHeader(["Immatriculation","Utilisateur" , "Début", "Fin", "Objet", "Description"]);
    await this.GetUsages();
    let table = this.table;
    this.listUsages.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.vehicle.registration,
          element.user.name,
          element.start,
          element.end,
          element.purpose,
          element.description,
          table.AddButton(element._id, "Editer", this.Edit),
          table.AddButton(element._id, "Supprimer", this.Suppr)
        ]
        );
      
    });
  }

  Edit(e){
    console.log(e.id);
    let json = {
      "description" : "twingo"
    }
    v.PutUsages("usages/" + e.id, json);
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

  async PutVehicle(uri, json){
    await this.req.Put(uri, json);
    this.result = req.json;
  }

  async DisplayVehicles(){
    this.table = new Table("vehicleContent", "tableVehicle");
    this.table.AddHeader(["Immatriculation", "Description", "Autonomie", "Energie", "Place"]);
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
          table.AddButton(element._id, "Editer", this.Edit),
          table.AddButton(element._id, "Supprimer", this.Suppr)
        ]
        );
      
    });
  }

  Edit(e){
    console.log(e.id);
    if(document.getElementById("vehicleForm")){
      document.getElementById("vehicleForm").remove();
    }
    let form = new Form("vehicleContent", "vehicleForm", [
      {"type": "text", "value": "Immatriculation"},
      {"type": "text", "value": "Description"}
    ]);

    // let json = {
    //   "description" : "twingo"
    // }
    // v.PutVehicle("vehicles/" + e.id, json);
  }

  Suppr(e){
    console.log(e.id);
  }
}

class Form{
  constructor(domTargetId, id, json){
    this.domTarget = document.getElementById(domTargetId);
    this.data = json;
    this.id = id;
    this.InitForm();
  }

  InitForm(){
    this.form = document.createElement("FORM");
    this.form.id = this.id;
    this.domTarget.appendChild(this.form);
    let form = this;
    this.data.forEach(function(e){
      let input = form.CreateInput(e.type, e.value);
      form.form.appendChild(input);
    })
  }

  CreateInput(type, value){
    let input;
    switch(type){
      case "text":
        input = document.createElement("INPUT");
        input.type = type;
        input.placeholder = value;
      break;
    }
    return input;
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

    async Put(uri, json){
      this.response = await fetch(this.url + uri, {
        method: "put",
        body: JSON.stringify(json),
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.json = await this.response.json();
    }
}